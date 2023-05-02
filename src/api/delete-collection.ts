import { ChromaClient } from "chromadb"
import type { FastifyRequest, FastifyReply } from "fastify"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

const client = new ChromaClient(process.env.CHROMA_URL)

export default async function DeleteCollection(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  await client.deleteCollection("test-collection")
  reply.send({ success: true })
}
