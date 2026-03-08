// import { EventEmitter } from 'node:events';
// class MyEmitter extends EventEmitter {}

// const myEmitter = new MyEmitter();
// // Only do this once so we don't loop forever
// myEmitter.once('newListener', (event, listener) => {
//   if (event === 'event') {
//     // Insert a new listener in front
//     myEmitter.on('event', () => {
//       console.log('B');
//     });
//   }
// });
// myEmitter.on('event', () => {
//   console.log('A');
// });
// myEmitter.emit('event');

// import { EventEmitter } from 'node:events';
// const myEmitter = new EventEmitter();

// // First listener
// myEmitter.on('event', function firstListener() {
//   console.log('Helloooo! first listener');
// });
// // Second listener
// myEmitter.on('event', function secondListener(arg1, arg2) {
//   console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
// });
// // Third listener
// myEmitter.on('event', function thirdListener(...args) {
//   const parameters = args.join(', ');
//   console.log(`event with parameters ${parameters} in third listener`);
// });

// console.log(myEmitter.listeners('event'));

// myEmitter.emit('event', 1, 2, 3, 4, 5);

// import { EventEmitter } from 'node:events';

// const myEE = new EventEmitter();
// myEE.on('foo', () => {
//   console.log('foo');
// });
// myEE.on('bar', () => {
//   console.log('bar')
// });

// const sym = Symbol('symbol');
// myEE.on(sym, () => {});

// console.log(myEE.eventNames());

// myEE.emit('foo');
// myEE.emit('bar');

// Write the data to the supplied writable stream one million times.
// Be attentive to back-pressure.

// import { createWriteStream } from 'node:fs';

// const ws = createWriteStream('./data.txt');

// function writeBadWay() {
//   for (let i = 0; i < 10000000; i++) {
//     ws.write('hello');
//   }
// }

// function writeOneMillionTimes(writer, data, encoding, callback) {
//   let i = 10000000;
//   write();
//   function write() {
//     let ok = true;
//     do {
//       i--;
//       if (i === 0) {
//         // Last time!
//         writer.write(data, encoding, callback);
//       } else {
//         // See if we should continue, or wait.
//         // Don't pass the callback, because we're not done yet.
//         ok = writer.write(data, encoding);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       // Had to stop early!
//       // Write some more once it drains.
//       writer.once('drain', write);
//     }
//   }
// }

// writeOneMillionTimes(ws, 'hello', 'utf8', () => {
//   console.log("done");
// });

// writeBadWay();