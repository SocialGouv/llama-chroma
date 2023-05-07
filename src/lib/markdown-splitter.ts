type Chunk = {
  content: string
  size: number
}

export default function markdownSplitter(
  markdown: string,
  maxSize = 1000
): Chunk[] {
  const lines = markdown.split(/\r?\n/)
  const chunks: Chunk[] = []
  let currentChunk = {
    content: "",
    size: 0,
  }

  function pushCurrentChunk() {
    if (currentChunk.content) {
      chunks.push(currentChunk)
      currentChunk = {
        content: "",
        size: 0,
      }
    }
  }

  let inCodeBlock = false
  let inTable = false
  let inList = false
  let inQuote = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock
    }

    if (trimmedLine.startsWith("|")) {
      inTable = !inTable
    }

    if (
      trimmedLine.startsWith("-") ||
      trimmedLine.startsWith("*") ||
      trimmedLine.startsWith("1.")
    ) {
      inList = !inList
    }

    if (trimmedLine.startsWith(">")) {
      inQuote = !inQuote
    }

    const inStructuredElement = inCodeBlock || inTable || inList || inQuote

    if (inStructuredElement) {
      if (currentChunk.size + line.length + 1 > maxSize) {
        pushCurrentChunk()
      }

      currentChunk.content += line + "\n"
      currentChunk.size += line.length + 1
    } else {
      if (trimmedLine.startsWith("#")) {
        pushCurrentChunk()
      }

      if (currentChunk.size + line.length + 1 > maxSize) {
        pushCurrentChunk()
      }

      currentChunk.content += line + "\n"
      currentChunk.size += line.length + 1
    }
  }

  pushCurrentChunk()

  return chunks
}
