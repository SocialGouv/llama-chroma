export default function markdownSplitter(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/)
  const chunks: string[] = []
  let currentChunk = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^#+\s/.test(line)) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
      }
      currentChunk = line
    } else {
      currentChunk += "\n" + line
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}
