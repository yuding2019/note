# React Hooks

### useState

`useState`返回一个数组，包含声明的state以及更新state的方法dispatch

```js
// 可以声明多个不同的state，但是推荐将相关的状态集中在一个state中。
const [state, setState] = useState(1);

// `useState`还可以接受一个函数作为参数，将该函数的返回值作为这个state的初始值
// 使用这种方式传递的初始值只会在组件挂载的时候生效，后续更新不会再次调用该函数产生新的初始值
// 原因是因为`mount`和`update`时，`useState`分别指向两个方法`mountState`和`updateState`
// `update`时，调用`useState`等于调用`updateState`，该方法中将忽略传递的参数
const [state, setState] = useState(() => 1);
```

hook是基于链表实现的，所以所有的hook都严格依赖调用顺序，这就是不能在函数或者if中使用
