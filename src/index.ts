import path from "path"
import * as fs from "fs"
import Fastify from "fastify"
import { ChromaClient } from "chromadb"

import markdownSplitter from "./markdown-splitter"
import { getEmbeddings } from "./embedding"

const DIRECTORY_PATH = "./data"

const fastify = Fastify({
  logger: true,
})

const client = new ChromaClient()

fastify.get("/", async (_request, reply) => {
  const files = await getFiles()
  console.log("files", files)
  await addFilesToCollection(files)
  reply.send({ indexedFiles: files.length })
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})

async function addFilesToCollection(files: string[]) {
  for (const file of files) {
    await addFileToCollection(file)
  }
}

async function addFileToCollection(filePath: string) {
  const collection = await client.getOrCreateCollection("test-collection")
  const content = fs.readFileSync(filePath).toString()
  const chunks = markdownSplitter(content)
  const embeddings = await Promise.all(
    chunks.map((chunk) => getEmbeddings(chunk.content))
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

  console.info(`${filePath}: added ${chunks.length} chunks`)
  return {
    content,
    chunks,
    path: filePath,
  }
}

function getFiles() {
  return readDirectoryRecursive(DIRECTORY_PATH)
}

function readDirectoryRecursive(directoryPath: string): string[] {
  const files = fs.readdirSync(directoryPath)
  return files.flatMap((file: string) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      return readDirectoryRecursive(filePath)
    } else {
      return `${directoryPath}/${file}`
    }
  })
}
