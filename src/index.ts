import * as dotenv from "dotenv"
dotenv.config()

import Fastify from "fastify"

import Indexing from "./api/indexing"

const fastify = Fastify({
  logger: true,
})

fastify.get("/api/indexing", Indexing)
fastify.get("/api/healthz", async () => ({ success: true }))

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
