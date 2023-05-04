import { ChromaClient } from "chromadb"
import type { FastifyRequest, FastifyReply } from "fastify"

import { getEmbeddings } from "../lib/llama"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

const client = new ChromaClient(process.env.CHROMA_URL)

export default async function Query(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { text, collection: collectionName } = request.query as Record<
    string,
    string
  >
  const collection = await client.getCollection(
    collectionName || process.env.DEFAULT_COLLECTION || ""
  )
  const embeddings = await getEmbeddings(text)
  const result = collection.query(embeddings, 5, undefined, [text])
  reply.send({ result })
}
