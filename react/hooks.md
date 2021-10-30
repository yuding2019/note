# React Hooks

hook是基于链表实现的，所以所有的hook都严格依赖调用顺序，所以不能在函数或者if中使用

React内部会维持一个全局变量`ReactCurrentDispatcher`，在hook调用时，会在内部切换不同的dispatcher，在不合理调用的时候，`ReactCurrentDispatcher`中的hook函数会主动抛出错误

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

### useReducer

`useReducer`和`Redux`用法差不多，而且在update时，`useState`底层调用的是`useReducer`

```js
function reducer(state, action) {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload };
    default: 
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { value: 1 });

  // ...
}
```

还接受函数作为第三个参数，该函数的参数为`useReducer`的第二个参数

### useEffect

处理副作用的hook，比如需要在渲染后获取dom节点进行操作、组件挂载后进行请求接口

```js
// mount以及后续的update都会触发这个回调函数
useEffect(() => {
  document.title = '2333';
});

// mount以及后续value发生变化时会触发这个回调
useEffect(() => {
  console.log(value);
}, [value]);
```

第二个参数是effect依赖数组，当依赖数组里面的某一项发生变化就会在后续调用传入的回调

> 第二项传递`null`是不会阻止回调函数的触发的，在update时，内部会判断传入的依赖是否为`null`，为`null`直接进入正常的更新流程

> 在其他需要依赖数组的hook中，对依赖的判断逻辑和effect一致

> `useLayoutEffect`和`useEffect`一样，不过是在画面刷新之前调用，在这个hook里面可以同步获取最新的dom状态然后变更状态

### useMemo/useCallback

用于缓存、优化性能的hook

> `useMemo`用于缓存函数返回的结果，`useCallback`用于缓存传入的回调函数

```js
// 这样可以保证每次渲染，只要依赖不变，就不会重新执行回调函数
const memoState = useMemo(
  () => {
    // 耗时操作，比如递归遍历tree
    return .....;
  },
  [/* 回调函数里面依赖的值 */]，
);

// 只要依赖值没有变化，cb永远引用同一个回调函数，可以放心作为其他依赖或者结合`mome`进行性能优化
const cb = useCallback(
  () => { /*  */ },
  [/* 回调函数里面依赖的值 */],
);
```

> `useMemo`可以返回一个jsx，所以可以对组件内部的视图进行更精细化的缓存优化

> __不要过早优化__

### useRef/useImperativeHandle

### useContext
