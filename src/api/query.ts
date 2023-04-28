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
  const collection = await client.getCollection("test-collection")
  const { query } = request.query as Record<string, string>
  const embeddings = await getEmbeddings(query)
  const result = collection.query(embeddings, 5, undefined, [query])
  reply.send({ result })
}
