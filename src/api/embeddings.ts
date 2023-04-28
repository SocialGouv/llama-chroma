import type { FastifyRequest, FastifyReply } from "fastify"

import { getEmbeddings } from "../lib/llama"

if (!process.env.CHROMA_URL) {
  throw new Error("process.env.CHROMA_URL is undefined")
}

export default async function Embeddings(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { text } = request.query as Record<string, string>
  const embeddings = await getEmbeddings(text)
  reply.send({ embeddings })
}
