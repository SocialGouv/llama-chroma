import { ChromaClient, Collection } from "chromadb";
import * as fs from "fs";
import path from "path";
import pAll from "p-all";
import { vectorizeDocument, vectorizeQuery } from "./vectorizer";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import splitMarkdownToChunks from "./md-split";
function readDirectoryRecursive(directoryPath: string): string[] {
  const files = fs.readdirSync(directoryPath);
  return files.flatMap((file: string) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      return readDirectoryRecursive(filePath);
    } else {
      return `${directoryPath}/${file}`;
    }
  });
}

async function embedDocuments(documents: string[]) {
  return pAll(
    documents.map(
      (document) => () => vectorizeQuery(document)
      //                vectorizeDocument(title, document)
    ),
    { concurrency: 3 }
  );
}

const init = (collection: Collection) =>
  pAll(
    readDirectoryRecursive("../../code-du-travail/fiches-vdd/md")
      //.slice(0, 5)
      .map((filePath) => async () => {
        const content = fs.readFileSync(filePath).toString();
        const chunks = splitMarkdownToChunks([content])[0];
        const embeddings = await embedDocuments(
          chunks.map((chunk, i) => chunk.content)
        );
        try {
          await collection.add(
            chunks.map((file, i) => `${filePath}-${i}`),
            embeddings,
            chunks.map((file) => ({ path: filePath, type: file.type })),
            chunks.map((file) => file.content)
          );
        } catch (e) {
          console.log("error posting to chroma", e);
        }
        console.info(`${filePath}: added ${chunks.length} chunks`);
        return {
          content,
          chunks,
          path: filePath,
        };
      }),
    { concurrency: 1 }
  );

async function chromaQuery(collection: Collection, query: string) {
  const embedQuery = await vectorizeQuery(query);

  return collection.query(
    embedQuery, // query_embeddings
    5, // n_results
    undefined, //{"metadata_field": "is_equal_to_this"}, // where
    [query] // query_text
  );
}

const test = async () => {
  const client = new ChromaClient();

  // const embeddingFunction = () => {
  //   console.log("embeddingFunction");
  //   return {
  //     generate: embedDocuments,
  //   };
  // };

  const collection = await client.getOrCreateCollection(
    "vdd2"
    //embeddingFunction

    //undefined
    //(embedding_function = emb_fn)
  );

  //collection.delete();
  //await init(collection);

  const count = await collection.count();

  console.log(`Collection ${collection.name} ready : ${count} entries`);

  const testQuery = async (query: string) => {
    // const query = "Comment envoyer un message electronique"; //"Comment chiffrer mes secrets ?"; // "Comment mesurer mes performances applicatives ?";
    const response = await chromaQuery(collection, query);
    //console.log(query, JSON.stringify(response.ids, null, 2));
    console.log("");
    console.log(query);
    response.ids[0].forEach((id: string) => {
      const md = fs.readFileSync(id.replace(/-\d+$/, "")).toString();
      const title = md.split("\n").find((row) => row.startsWith("title:"));
      const ficheId = md.split("\n").find((row) => row.startsWith("id:"));
      console.log(ficheId, title);
    });
  };

  await testQuery("Comment calculer mon salaire");
  await testQuery("Comment faire mon passeport");
  await testQuery("Comment divorcer");
};

test();
