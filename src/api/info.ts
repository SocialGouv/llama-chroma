import { ChromaClient } from "chromadb"
import type { FastifyRequest, FastifyReply } from "fastify"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

const client = new ChromaClient(process.env.CHROMA_URL)

export default async function Info(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { collection: collectionName } = request.query as Record<string, string>
  const collection = await client.getCollection(
    collectionName || process.env.DEFAULT_COLLECTION || ""
  )

  try {
    const data = await collection.peek()
    const count = await collection.count()
    return reply.send({ data, count })
  } catch (error) {
    return reply.send({ error })
  }
}
