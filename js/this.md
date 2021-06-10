# this

2021-05-30

#### 主要内容

1. `this`绑定规则，明白普通函数、箭头函数的`this`指向
2. 实现简易的`call`、`apply`、`bind`函数

## 调用栈

在代码中插入`debugger`语句可以在chrome等浏览器中进行代码调试，就可以看到当前断点信息，包括函数调用栈、作用域等信息

![debugger](./img/debugger.jpg 'debugger')

其中在作用域信息中可以看到当前函数中`this`的指向

> `Local`：当前函数内部的作用域，可以看到当前`this`的指向以及在函数内部声明的变量
>
> `Script`：使用`let`、`const`声明的全局变量就是它的属性，它与`Global`平级，但是我们无法访问这个”作用域对象“。
>
> `Global`：总所周知，如果使用`var`声明全局变量，那这个变量就会成为`Global`的属性
>
> `Closure`：如果断点在一个有闭包的函数内，就可以看到这个作用域信息，包含这个函数内已经访问的闭包属性

## 绑定规则

1. 默认绑定

独立函数调用，非严格模式下`this`指向global，严格模式下`this`是undefined

```js
var aGlobal = 'a-global';

function fun1() {
  'use strict';

  debugger;
  this.aGlobal; // TypeError
}

function fun2() {
  fun1();
  this.aGlobal; // Global.aGlobal
}

fun2();
```

2. 隐式绑定

如果函数调用时存在上下文对象，简单来说就是使用某个对象属性简单调用函数，`this`指向该对象，仅限离该函数“最近”的对象

```js
const objWithFun = {
  prop1: 'prop 1',
  fun: function fun() {
    debugger;
    this.prop1; // objWithFun.prop1
  }
}
objWithFun.fun();

const objWithFunInDeeper = {
  outerProp: 'outer prop',
  innerObj: {
    innerProp: 'inner prop',
    fun: function fun() {
      debugger;
      this.innerProp; // 'inner prop'
      this.outerProp; // undefined
    }
  }
}
objWithFunInDeeper.innerObj.fun();
```

> 当将对象上的普通函数赋值给变量或者当作回调传入时，这个函数内部的`this`就会丢失当前指向，重新指向global或者undefined

3. 显示绑定

使用`call`、`apply`、`bind`进行手动绑定内部的`this`指向

```js
// `call`后续参数会原封不动传递给fun1
// `params`: [1, 2, 3, 4]
function fun1(...params) {
  debugger;
  console.log(this); // { a: 1 }
}
fun1.call({ a: 1 }, 1, 2, 3, 4);

// `apply`的后续参数会被解构后传入fun2
// `params`: [1, 2, 3, 4]
// 注意：`apply`后续参数的解构只会对数组进行解构，非数组对象fun2接收不到
function fun2(...params) {
  debugger;
  console.log(this); // { b: 2 }
}
fun2.apply({ b: 2 }, [1, 2, 3, 4]);

// `bind`后续参数将会作为原函数的预设参数，然后调用时传入的参数会接在预设参数后面
// `params`: [1, 2, 3, 4, 5, 6]
function fun3(...params) {
  debugger;
  console.log(this); // { c: 3 }
}
(fun3.bind({ c: 3 }, 1, 2, 3, 4))(5, 6);
```

> 并没有对`apply`和`call`进行简单性能测试，个人认为日常开发时这些差异可以忽略不计，更应该纳入考虑的是可读性（传参时参数怎么写简单明了就应该怎么写）

4. `new`

```js
// 通过`new`调用函数，函数内部`this`就指向一个对象，这个对象包含类似`this.name`这样声明的属性
// 如果没有使用return返回，那么就默认返回`this`
// 使用一个变量保存`this`指向，请勿日常开发写这样代码👻
let _ref;
function Student(name, age) {
  this.name = name;
  this.age = age;
  
  debugger;
  console.log(this);
  _ref = this;
}

// 如果`Student`手动返回一个值，那么`_ref`就和`stu`不相等了
// 如果没有`_ref`类似的操作保存函数内部的对象，那么在函数调用结束后，这个对象就没了
const stu = new Student('name', 18);
console.log(_ref === stu); // true
```

> 普通调用函数时，四种绑定优先级为`new` > `bind` > 上下文对象 > 默认

## 实现`call` `applay` `bind`

```js
// 利用`this`的隐式绑定规则，在传入的`context`对象上创建一个当前函数引用
// 然后调用返回结果
// `apply`实现原理一致，区别将参数部分替换成真实数组，调用函数求值时再展开
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
```

> 这里使用了简便的`...args`语法，如果要使用之前的语法环境实现，就存在一个问题，无法动态创建变量，也就无法展开数组
> 除非使用`eval()`函数的👿（如果有其他方式欢迎告知👻）

```js
// 取巧实现😁
Function.prototype.myBind = function(context, ...args) {
  const fun = this;
  return function(..._args) {
    // 23333
    return fun.myCall(context, ...args, ..._args);
  }
}
function fun1(a, b, c) {
  // 只是这里不够好，会打印出在`myCall`中添加的helper属性
  console.log({ ...this }); // { hello: 'world', 'my-call_xxxxxxx': function }
  return a + b + c;
}

const testBind = fun1.myBind({ hello: 'world' }, 1, 2);
console.log(testBind(3)); // 6
```

> 这里的全部实现都比较简单，并没有考虑很多边界条件

## 箭头函数

箭头函数本身没`this`，它的`this`是“继承”于上层函数或者全局的`this`

```js
function outerFun() {
  debugger;
  const ref = this;

  return () => {
    console.log(this, this === ref); // { a: 1 } true
  }
}

outerFun.call({ a: 1 })();
```

```js
// `call`也不能改变
const arrow = () => {
  console.log(this.a); // undefined
}
arrow.call({ a: 1 });
```
