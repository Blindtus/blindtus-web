import fs from 'fs';
import path from 'path';

export async function loadMarkdown(filePath: string) {
  const fullPath = path.join(process.cwd(), 'src/content', filePath);
  return fs.readFileSync(fullPath, 'utf8'); // Return raw markdown content
}
