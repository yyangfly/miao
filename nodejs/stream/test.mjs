import fs from 'fs';
import { Transform } from 'stream';

// ----------------------
// 1. 可读流
// ----------------------
const readable = fs.createReadStream('./input.txt', { encoding: 'utf8', highWaterMark: 16 }); 
// highWaterMark: 每次缓冲区大小，演示背压用

// ----------------------
// 2. 可写流
// ----------------------
const writable = fs.createWriteStream('./output.txt', { encoding: 'utf8' });

// ----------------------
// 3. Transform 流（转换数据）
// ----------------------
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // chunk 是 Buffer 或 string
    const upperChunk = chunk.toString().toUpperCase();
    callback(null, upperChunk); // push 转换后的数据
  }
});

// ----------------------
// 4. 处理背压 & 监听事件
// ----------------------
// writable.on('drain', () => {
//   console.log('Writable stream drained, continue writing...');
// });

// readable.on('data', (chunk) => {
//   const ok = writable.write(chunk); // write 返回 false → 背压触发
//   if (!ok) {
//     console.log('Backpressure! Pausing readable...');
//     readable.pause(); // 暂停读取
//   }
// });

// writable.on('finish', () => {
//   console.log('Writable finished!');
// });

// readable.on('end', () => {
//   console.log('Readable ended!');
//   writable.end(); // 结束写入
// });

// readable.on('error', (err) => console.error('Readable error:', err));
// writable.on('error', (err) => console.error('Writable error:', err));

// ----------------------
// 5. 使用 pipe（最常用方式）
// ----------------------
readable.pipe(upperCaseTransform).pipe(writable);