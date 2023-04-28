import * as dotenv from "dotenv"
dotenv.config()

import Fastify from "fastify"

import Query from "./api/query"
import Indexing from "./api/indexing"
import Embeddings from "./api/embeddings"

const fastify = Fastify({
  logger: true,
})

fastify.get("/api/indexing", Indexing)
fastify.get("/api/query/:query", Query)
fastify.get("/api/embeddings", Embeddings)
fastify.get("/api/healthz", async () => ({ success: true }))

const port = parseInt(process.env.PORT || "") || 3000

fastify.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) throw err
  console.log(`✅ API running on port ${port}`)
})
