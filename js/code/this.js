Function.prototype.myCall = function(context, ...args) {
  const fun = this;

  // 暂时不考虑传入的context为number等基本类型
  // 传入这些时，原生实现会进行装箱操作，转为对应的对象（number -> Number）
  // 这里简单实现，就暂时不考虑这些的😁
  const _context = typeof context === 'object' && context !== null
    ? context
    : globalThis;
  
  const helper =  `my-call_${Date.now()}`;
  _context[helper] = fun;
  const res = _context[helper](...args);
  delete _context[helper];

  return res;
}

Function.prototype.myBind = function(context, ...args) {
  const fun = this;
  return function(..._args) {
    return fun.myCall(context, ...args, ..._args);
  }
}

function fun1(a, b, c) {
  console.log({ ...this });
  return a + b + c;
}

const testBind = fun1.myBind({ hello: 'world' }, 1, 2);
console.log(testBind(3));
