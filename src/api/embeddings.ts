import type { FastifyRequest, FastifyReply } from "fastify"

import { getEmbeddings } from "../lib/llama"

export default async function Embeddings(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { text } = request.query as Record<string, string>
  const embeddings = await getEmbeddings(text)
  reply.send({ embeddings })
}
