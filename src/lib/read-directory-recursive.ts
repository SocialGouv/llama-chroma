import path from "path"
import * as fs from "fs"

export default function readDirectoryRecursive(
  directoryPath: string
): string[] {
  const files = fs.readdirSync(directoryPath)
  return files.flatMap((file: string) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      return readDirectoryRecursive(filePath)
    } else {
      return `${directoryPath}/${file}`
    }
  })
}
