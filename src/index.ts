import * as dotenv from "dotenv"
dotenv.config()

import Fastify from "fastify"

import Query from "./api/query"
import Indexing from "./api/indexing"
import Embeddings from "./api/embeddings"
import DeleteCollection from "./api/delete-collection"
import Info from "./api/info"

const fastify = Fastify({
  logger: true,
})

fastify.get("/api/info", Info)
fastify.get("/api/query", Query)
fastify.get("/api/indexing", Indexing)
fastify.get("/api/embeddings", Embeddings)
fastify.get("/api/delete-collection", DeleteCollection)
fastify.get("/api/healthz", async () => ({ success: true }))

const port = parseInt(process.env.PORT || "") || 3000

fastify.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) throw err
  console.log(`✅ API running on port ${port}`)
})
