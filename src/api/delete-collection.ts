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
  const { name } = request.query as Record<string, string>
  try {
    await client.deleteCollection(name)
    reply.send({ success: true })
  } catch (error) {
    console.log("DeleteCollection:", error)
    reply.send({ success: false })
  }
}
