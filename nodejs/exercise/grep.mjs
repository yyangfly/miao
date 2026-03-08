import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

if (process.argv.length < 4) {
  console.error("Usage: node app.js <regex> <file...>");
  process.exit(1);
}

let regex;
try {
  regex = new RegExp(process.argv[2]);
} catch {
  console.error("Invalid regex");
  process.exit(1);
}

for (let i = 3; i < process.argv.length; i++) {
  const path = process.argv[i];
  processPath(path);
}

function processPath(path) {
  if (isDirectory(path)) {
    const items = readdirSync(path);

    for (const item of items) {
      const fullPath = join(path, item);
      processPath(fullPath);
    }
  } else {
    try {
      const content = readFileSync(path, 'utf8');

      regex.lastIndex = 0; // 防止 g 影响

      if (regex.test(content)) {
        console.log(path);
      }
    } catch {
      console.error(`Cannot read file ${path}`);
    }
  }
}

function isDirectory(path) {
  try {
    return statSync(path).isDirectory()
  } catch (err) {
    console.error('Error:', err.message)
    return false
  }
}
