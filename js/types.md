# 类型

#### 主要内容

1. 类型介绍
2. 类型转换

## 类型

目前，js总共存在八种类型

其中七种基本类型：
- boolean
- bigint
- number
- string
- symbol
- null
- undefined

以及`object`

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

主要是关于对象转`number/string`的时候判断步骤与方式，转`boolean`时基本上都是转为`true`

> 特例：`Boolean(document.all) === false`，这个属性已被废弃，但是并没删除，对其进行`typeof`结果为`undefined`👻

对象转基本类型值一般涉及两个方法：`valueOf`与`toString`

> 步骤有三，顺序未定：
> 1. 判断对象是否存在`valueOf`方法，并且该方法返回的是基本类型值，则调用`valueOf`，将返回值转为对应基本类型值
> 2. 判断对象是否存在`toString`方法，并且该方法返回的是基本类型值，则使用`toString`方法，将返回值转为对应基本类型值
> 3. 如果不存在上述两个方法或者两个方法都未返回基本类型值，则报错

```js
const a = {
  valueOf() {
    console.log('call valueOf');
    return this;
  },
  toString() {
    console.log('call toString');
    return '1';
  }
}
console.log(Number(a));
// call valueOf
// call toString
// 1

const b = {
  valueOf() {
    console.log('call valueOf');
    return 1;
  },
  toString() {
    console.log('call toString');
    return this;
  }
}
console.log(String(b));
// call toString
// call valueOf
// 1
```

> 转数值时，判断步骤顺序为：1 -> 2 -> 3
> 转字符串时，判断步骤顺序为：2 -> 1 -> 3
> 类似`a + ''`、`+a`等操作转换时，遵循转数值的判断步骤

> 数组自己实现了`toString`方法，返回元素的字符串形式，等价于`[].join(',')`，所以空数组转数值为0，非空数组按照上述步骤判断即可

> ##
> ### 如有错误，欢迎批评指正
> ##

> `'JavaScript ' + ([][{}] + {})[+[] - ~{}] + ({} + {})[+[] - ~{} - ~{}]` "JavaScript nb"
