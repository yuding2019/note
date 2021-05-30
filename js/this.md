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
> `Closure`：如果断点在一个有闭包的函数内，就可以看到这个作用域信息，包含这个函数能够访问的闭包属性

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
```

4. `new`


