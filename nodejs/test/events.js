class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, handler) {
    this.events.set(eventName, handler);
  }

  emit(eventName, ...args) {
    if (this.events.has(eventName)) {
      let handler = this.events.get(eventName);
      handler(...args);
      return true;
    } else {
      return false;
    }
  }
}

let emitter = new EventEmitter();

emitter.on('print', (...args) => {
  for (let arg of args) {
    console.log(arg);
  }
});

emitter.emit('print', 'hello', 'world');

emitter.emit('hello', true);

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

await delay(2000)

console.log(8)