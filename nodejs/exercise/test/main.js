import { mkdir, statSync } from 'node:fs';

const path = process.argv[2];

mkdir(path, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});