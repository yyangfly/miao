class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  plus(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
  minus(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}


var a = new Vector(1, 2)
var b = new Vector(4, 5)
var c = a.plus(b) //  new Vector(5, 7)
console.log(c.x) // 5
console.log(c.y) // 7
console.log(c.length) // results in Math.sqrt(5*5+7*7)




// Complex类表示一个复数
// 它有两个属性，real和imag分别表示实部和虚部
class Complex {
  real;
  imag;
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
  }
  plus(c) {
    return new Complex(this.real + c.real, this.imag + c.imag);
  }
  minus(c) {
    return new Complex(this.real - c.real, this.imag - c.imag);
  }
  mul(c) {
    return new Complex(this.real * c.real - this.imag * c.imag,
                       this.real * c.imag + this.imag * c.real);
  }
}


var d = new Complex(1, 2) // 1+2i
var e = new Complex(3, -4) // 3-4i

var f = d.plus(e) // 4-2i
var g = e.mul(f) // 4-22i
console.log(g.real) // 4
console.log(g.imag) // -22


// 实现一个类似js中Array的类型
// 即长度可变的数组
// 实现过程中只能通过new Array(n)创建出固定长度的数组
// 此后再也不能修改这个数组的长度
//    如push，pop，shift，unshift，修改length，给length及以上的下标赋值
class ArrayList {
  nums;
  size;
  constructor() {
    this.nums = new Array(512);
    this.size = 0;
  }
  // 返回第idx位置的值
  at(idx) {
    if (idx >= this.size) {
      return null;
    } else {
      return this.nums[idx];
    }
  }
  push(val) {
    if (this.size >= this.nums.length) {
      var newNums = new Array(this.size << 1);
      for (let i = 0; i < this.size; i++) {
        newNums[i] = this.nums[i];
      }
      this.nums = newNums;
    }
    this.nums[this.size] = val;
    this.size += 1;
  }
  pop() {
    if (this.size <= 0) {
      return null;
    } else {
      this.size -= 1;
      var popNum = this.nums[this.size];
      if (this.size < 0.25 * this.nums.length) {
        var newNums = new Array(Math.floor(this.nums.length / 2));
        for (let i = 0; i < this.size; i++) {
          this.nums[i] = newNums[i];
        }
        this.nums = newNums;
      }
      return popNum;
    }
  }
  // 返回数组元素的数量
  get length() {
    return this.size;
  }
}


var h = new ArrayList()

for (var i = 0; i < 10000; i++) {
  h.push(i)
}

console.log(h.at(15)) // 15
console.log(h.at(80)) // 80
console.log(h.length) // 10000
console.log(h.pop()) // 9999
console.log(h.length) // 9999



/**
 * 用单向链表实现一个先进先出的队列
 * 
 */
class ListNode {
  constructor(val, prev = null, next = null) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}
class Queue {
  head;
  tail;
  size;
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  // 将值val放进队列，放进队列的元素会先进先出
  enqueue(val) {
    if (this.size === 0) {
      this.head = new ListNode(val);
      this.tail = this.head;
    } else {
      var newNode = new ListNode(val);
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.size += 1;
  }
  // 返回队头元素，当队列为空时，返回undefined
  dequeue() {
    if (this.size === 0) {
      return undefined;
    } else if (this.size === 1) {
      var node = this.head;
      this.head = null;
      this.tail = null;
      this.size -= 1;
      return node.val;
    } else {
      var oldHeadNode = this.head;
      this.head = this.head.next;
      this.head.prev.next = null;
      this.head.prev = null;
      this.size -= 1;
      return oldHeadNode.val;
    }
  }
  // 返回但不删除队头元素
  peek() {
    return this.head.val;
  }
  // 返回队列的长度
  get size() {
    return this.size;
  }
}


var q = new Queue()

q.enqueue(5)
q.enqueue(6)

console.log(q.dequeue()) // 5

q.enqueue(8)
q.enqueue(9)

console.log(q.dequeue()) // 6
console.log(q.dequeue()) // 8
console.log(q.size) // 1



// 表达一个“集合”
// 即元素不重复的合集
class MySet {
  nums = new Array(1024);
  size = 0;
  // 往集合中增加一个元素，但元素如果已经在集合里，则不用增加了
  add(val) {
    if (this.size < this.nums.length) {
      this.nums[val % this.nums.length] = val;
    }
  }
  // 判断集合中是否有val
  has(val) {
    return this.nums[val % this.nums.length] != undefined;
  }
  // 从集合中删除val
  delete(val) {
    if (this.nums[val % this.nums.length] != "undefined") {
      this.nums[val % this.nums.length] = undefined;
      this.size -= 1;
    }
  }
  // 清空集合中的元素
  clear() {
    nums = new Array(1024);
    this.size = 0;
  }
  // 返回集合中元素的数量
  get size() {
    return this.size;
  }
}

var s = new MySet()
s.add(1)
s.add(1)
s.size // 1
s.add(2)
s.size // 2
s.delete(1)
s.size // 1
console.log(s.has(2)) // true
console.log(s.has(1)) // false



// 表达一个映射
// 每组映射有一个key和一个value确定
// 增删改查：
// 实现过程中不能将对象做为映射来使用（意思是不能使用对象“随意增减属性”的功能）
class MyMap {
  
  constructor() {
    this.buckets = new Array(1024).fill(null);
    this.capacity = 1024;
    this.size = 0;
  }
  // 把key的值设置为val
  // 如果存在key，将其值由旧的映射为新的
  // 如果不存在key，则新增这一组映射
  set(key, val) {     //   obj[key] = val
    const MOD = key % this.buckets.length;
    var p = this.buckets[MOD];
    while (p) {
      if (p.key === key) {
        p.val = val;
        return;
      }
      p = p.next;
    }
    var node = {key: key, val: val};
    node.next = this.buckets[MOD];
    this.buckets[MOD] = node;
    this.size += 1;
  }
  // 获取key的映射目标    obj[key]
  get(key) {
    if (this.has(key)) {
      const MOD = key % this.buckets.length;
      var p = this.buckets[MOD];
      while (p) {
        if (p.key === key) {
          return p.val;
        }
        p = p.next;
      }
      return null;
    } else {
      return null;
    }
  }
  // 判断当前map中是否存在key     key in obj
  has(key) {
    const MOD = key % this.buckets.length;
    var p = this.buckets[MOD];
    while (p) {
      if (p.key === key)
        return true;
      p = p.next;
    }
    return false;
  }
  // 删除key对应的映射对
  delete(key) {   //    delete   obj[key]
    if (this.has(key)) {
      this.size -= 1;
      const MOD = key % this.buckets.length;
      var p = this.buckets[MOD];
      if (p.key === key) {
        this.buckets[MOD] = p.next;
        p.next = null;
        return true;
      } else {
        while (p.next.key != key) {
          p = p.next;
        }
        var nxt = p.next;
        p.next = nxt.next;
        nxt.next = null;
        return true;
      }
    } else {
      return false;
    }
  }
  // 返回当前map中映射对的数量
  get size() {
    return this.size;
  }
}
