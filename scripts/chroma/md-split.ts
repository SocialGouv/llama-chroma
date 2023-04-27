type MarkdownChunk = {
  content: string;
  type: "heading" | "paragraph" | "list" | "code" | "quote";
};

export default function splitMarkdownToChunks(
  markdownDocs: string[]
): MarkdownChunk[][] {
  const chunks: MarkdownChunk[][] = [];

  const markdownSplitter = (doc: string): MarkdownChunk[] => {
    const lines = doc.split("\n");
    const docChunks: MarkdownChunk[] = [];
    let currentChunk: MarkdownChunk | null = null;

    for (const line of lines) {
      if (/^#{1,6} /.test(line)) {
        if (currentChunk) {
          docChunks.push(currentChunk);
        }
        currentChunk = { content: line, type: "heading" };
      } else if (/^(\*|-|\+|\d+\.) /.test(line)) {
        if (!currentChunk || currentChunk.type !== "list") {
          if (currentChunk) {
            docChunks.push(currentChunk);
          }
          currentChunk = { content: "", type: "list" };
        }
        currentChunk.content += line + "\n";
      } else if (/^```/.test(line)) {
        if (currentChunk) {
          docChunks.push(currentChunk);
        }
        currentChunk = { content: line + "\n", type: "code" };
      } else if (/^>/.test(line)) {
        if (!currentChunk || currentChunk.type !== "quote") {
          if (currentChunk) {
            docChunks.push(currentChunk);
          }
          currentChunk = { content: "", type: "quote" };
        }
        currentChunk.content += line + "\n";
      } else if (/^\s*$/.test(line)) {
        if (currentChunk && currentChunk.type !== "code") {
          docChunks.push(currentChunk);
          currentChunk = null;
        } else if (currentChunk && currentChunk.type === "code") {
          currentChunk.content += line + "\n";
        }
      } else {
        if (!currentChunk || currentChunk.type !== "paragraph") {
          if (currentChunk) {
            docChunks.push(currentChunk);
          }
          currentChunk = { content: "", type: "paragraph" };
        }
        currentChunk.content += line + "\n";
      }
    }

    if (currentChunk) {
      docChunks.push(currentChunk);
    }

    return docChunks;
  };

  for (const doc of markdownDocs) {
    chunks.push(markdownSplitter(doc));
  }

  return chunks;
}
