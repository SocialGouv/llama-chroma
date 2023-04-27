import stopwords from "./stopwords.json";

// URL of the TF serve deployment
const NLP_URL = "https://serving-ml-preprod.dev.fabrique.social.gouv.fr";
const tfServeURL = NLP_URL + "/v1/models/sentqam:predict";

function stripAccents(text: string) {
  // strip accents
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const stopWords = new Set(stopwords.map(stripAccents));

const cache = new Map();

function preprocess(text: string) {
  const stripped = stripAccents(text);

  // 09/06/20 : cheap tokenizer, we should probably use something more solid
  // keep it like this for now to ensure embedding stability despite refactoring
  const split = stripped.split(" ");

  // remove stop words
  const noStopWords = split.filter((t) => !stopWords.has(t.toLowerCase()));

  return noStopWords.join(" ");
}

async function callTFServe(data: Record<string, any>) {
  const response = await fetch(tfServeURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then((r) => r.json());
  return response.outputs;
}

export async function vectorizeDocument(title: string, content: string) {
  if (title == undefined || title == "") {
    throw new Error("Cannot vectorize document with empty title.");
  }

  const input = [preprocess(title)];
  const context = content ? [preprocess(content)] : "";

  const body = {
    inputs: { context, input },
    signature_name: "response_encoder",
  };
  const vectors = await callTFServe(body);

  return vectors[0];
}

export async function vectorizeQuery(query: string) {
  if (!query) {
    throw new Error("Cannot vectorize empty query.");
  }

  const inputs = [preprocess(query)];
  const body = {
    inputs,
    signature_name: "question_encoder",
  };
  const vectors = await callTFServe(body);
  return vectors[0];
}
