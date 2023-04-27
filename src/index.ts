import * as dotenv from "dotenv"
dotenv.config()

import Fastify from "fastify"

import Indexing from "./api/indexing"

const fastify = Fastify({
  logger: true,
})

fastify.get("/indexing", Indexing)

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
