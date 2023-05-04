import { ChromaClient } from "chromadb"
import type { FastifyRequest, FastifyReply } from "fastify"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

const client = new ChromaClient(process.env.CHROMA_URL)

export default async function DeleteCollection(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { collection: collectionName } = request.query as Record<string, string>
  await client.deleteCollection(
    collectionName || process.env.DEFAULT_COLLECTION || ""
  )
  reply.send({ success: true })
}
