import * as dotenv from "dotenv"
dotenv.config()

import Fastify from "fastify"

import Indexing from "./api/indexing"

const fastify = Fastify({
  logger: true,
})

fastify.get("/api/indexing", Indexing)
fastify.get("/api/healthz", async () => ({ success: true }))

const port = parseInt(process.env.PORT || "") || 3000

fastify.listen({ port }, (err) => {
  if (err) throw err
  console.log(`✅ API running on port ${port}`)
})
