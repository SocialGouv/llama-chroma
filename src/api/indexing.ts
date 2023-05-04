import * as fs from "fs"
import { ChromaClient, type Collection } from "chromadb"
import type { FastifyRequest, FastifyReply } from "fastify"

import { getEmbeddings } from "../lib/llama"
import markdownSplitter from "../lib/markdown-splitter"
import readDirectoryRecursive from "../lib/read-directory-recursive"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

const client = new ChromaClient(process.env.CHROMA_URL)

async function addFileToCollection(filePath: string, collection: Collection) {
  console.log(`1/4 - Start processing file"${filePath}"`)
  const content = fs.readFileSync(filePath).toString()
  const chunks = markdownSplitter(content)
  console.log(
    `2/4 - File "${filePath}" has been splitted in ${chunks.length} chunks.`
  )
  const embeddings = await Promise.all(
    chunks.map((chunk) => getEmbeddings(chunk.content))
  )
  console.log(
    `3/4 - File "${filePath}" has generated ${embeddings.length} embeddings.`
  )
  try {
    await collection.add(
      chunks.map((_file, i) => `${filePath}-${i}`),
      embeddings,
      chunks.map((file) => ({ path: filePath, type: file.type })),
      chunks.map((file) => file.content)
    )
  } catch (e) {
    console.log("error posting to chroma", e)
  }

  console.info(
    `4/4 - File ${filePath} has added ${chunks.length} chunks to the collection.`
  )
  return {
    content,
    chunks,
    path: filePath,
  }
}

async function addFilesToCollection(files: string[], collectionName: string) {
  const collection = await client.getOrCreateCollection(collectionName)
  for (const file of files) {
    await addFileToCollection(file, collection)
  }
}

function getFiles() {
  if (process.env.DIRECTORY_PATH) {
    return readDirectoryRecursive(process.env.DIRECTORY_PATH)
  }
  throw new Error("process.env.DIRECTORY_PATH is undefined")
}

export default async function Indexing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const files = await getFiles()
  console.log("files", files)
  const { collection: collectionName } = request.query as Record<string, string>
  await addFilesToCollection(
    files,
    collectionName || process.env.DEFAULT_COLLECTION || ""
  )
  reply.send({ indexedFiles: files.length })
}
