import { ChromaClient } from "chromadb"
import { RequiredError } from "chromadb/dist/main/generated/base"
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

  console.log(
    "collectionName",
    collectionName,
    process.env.DEFAULT_COLLECTION,
    collectionName || process.env.DEFAULT_COLLECTION || ""
  )

  const collection = await client.getCollection(
    collectionName || process.env.DEFAULT_COLLECTION || ""
  )

  try {
    const data = await collection.peek()
    const count = await collection.count()
    return reply.send({ data, count })
  } catch (error) {
    const { message } = error as RequiredError
    throw new Error(message)
  }
}
