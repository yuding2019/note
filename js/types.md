# 类型

#### 主要内容

1. 类型介绍
2. 类型转换规则以及`valueOf()`与`toString()`优先级

## 类型

目前，js总共存在八种类型

其中七种基本类型：
- Boolean
- Bigint
- Number
- String
- Symbol
- null
- undefined

以及`object`类型

```js
typeof 1 === 'number';
typeof 1n === 'bigint';
typeof '' === 'string';
typeof true === 'boolean';

const a;
typeof a === 'undefined';
typeof undefined === 'undefined';
typeof (void 0) === 'undefined';

const b = Symbol('a');
typeof b === 'symbol';

const c = null;
typeof c === 'object';
typeof null === 'object';

typeof {} === 'object';

typeof Symbol === 'function';
```

> `null`为object是因为表示`null`的二进制全是0，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的，对象的类型标签是 0。
> 函数是一个可调用对象，`typeof`对函数有特别的返回值（JavaScript权威指南 - 4.13.2节）

## 类型转换

### 显示转换

通过显示的调用`Number()`、`Boolean()`、`String()`、`Object()`、`toString()`进行转换

> 日常开发推荐使用显示转换，简单直观明了
> 对于相对较常见的一些操作也可以从某种程度上视为显示转换，比如`!123`、`+'123'`等

### `valueOf`与`toString`

主要区分两种情况，普通对象转字符串和对象转数字

1. 显示将对象转为数字和字符串
```js
const a = {
  valueOf() {
    return 1;
  },
  toString() {
    return 2;
  },
};
Number(a) === 1;
String(a) === '2';
```

> 显示转换时转数字优先调用`valueOf`，转字符串优先`toString`

2. 通过运算符进行转换

```js
+a === 1;
a == 1; // true
a + 1 === 2;
a + '' === '1';
```

> 这类运算符大部分是执行转数字的操作，但是普通对象因为大部分的`valueOf`都是返回这个对象本身，所以最终会调用`toString`，既`1 + {} === '1[object Object]'`


