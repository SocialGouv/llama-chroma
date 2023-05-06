import * as dotenv from "dotenv"
dotenv.config()

import path from "path"
import { LLama } from "llama-node"
import { LLamaCpp, LoadConfig } from "llama-node/dist/llm/llama-cpp.js"

if (!process.env.LLAMA_MODEL) {
  throw new Error("process.env.LLAMA_MODEL is undefined")
}

const llama = new LLama(LLamaCpp)
const model = path.resolve(process.cwd(), process.env.LLAMA_MODEL || "")

const config: LoadConfig = {
  path: model,
  enableLogging: true,
  nCtx: 1024,
  nParts: -1,
  seed: 0,
  f16Kv: false,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: true,
  useMmap: true,
}

llama.load(config)

export async function getEmbeddings(prompt: string) {
  const params = {
    nThreads: 8,
    nTokPredict: 2048,
    topK: 40,
    topP: 0.1,
    temp: 0.2,
    repeatPenalty: 1,
    prompt,
  }

  return llama.getEmbedding(params)
}
