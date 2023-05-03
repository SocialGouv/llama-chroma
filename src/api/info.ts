import { ChromaClient } from "chromadb"
import type { FastifyRequest, FastifyReply } from "fastify"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

const client = new ChromaClient(process.env.CHROMA_URL)

export default async function Info(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const collection = await client.getCollection("test-collection")
  console.log("collection:", collection)
  try {
    const data = await collection.peek()
    const count = await collection.count()
    return reply.send({ data, count })
  } catch (error) {
    return reply.send({ error })
  }
}
