const { performance } = require('perf_hooks');
const { bubble, bubble2 } = require('./bubble');

/**
 * 
 * @param {Function} fn - 排序方法
 * @param {Array<number>} source - 原数组
 */
function test(fn, source) {
  const copy1 = [...source];
  const copy2 = [...source];

  const start1 = performance.now();
  const innerSort = copy1.sort((a, b) => a - b);
  const end1 = performance.now();
  
  const start2 = performance.now();
  const res = fn(copy2);
  const end2 = performance.now();

  console.log('内置排序耗时：', end1 - start1, 'ms');
  console.log('排序耗时：', end2 - start2, 'ms');
  if (innerSort.join(',') !== res.join(',')) {
    console.log('你的排序结果和内置排序结果不一致');
  }
  console.log('\n');
}

const len = 1000;
const arr = Array.from({ length: len }, () => ~~(Math.random() * len));

test(bubble, [...arr]);
// test(bubble2, [...arr]);
