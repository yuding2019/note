const { performance } = require('perf_hooks');
const { bubble, bubble2 } = require('./bubble');
const qucik = require('./quick');

function testInner(source) {
  const start = performance.now();
  const res = source.sort((a, b) => a - b);
  const end = performance.now();

  console.log('内置排序耗时：', end - start, 'ms');
  return res.join(',');
}

/**
 * @param {Function} fn - 排序方法
 * @param {Array<number>} source - 原数组
 */
function test(name, sort, source) {
  const start = performance.now();
  const res = sort(source);
  const end = performance.now();

  console.log(name, '排序耗时：', end - start, 'ms');
  if (stdResult !== res.join(',')) {
    console.log('你的排序结果和内置排序结果不一致');
  }
}

const len = 100000;
const arr = Array.from({ length: len }, () => ~~(Math.random() * len));
const stdResult = testInner([...arr]);

test('bubble', bubble, [...arr]);
test('qucik', qucik, [...arr]);
// console.log(qucik([5, 3, 6, 1, 2, 4]));
