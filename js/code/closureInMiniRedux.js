// 简易实现一个redux，redux的实现就大量使用闭包
function createStore(reducer, initialState) {
  // dispatch时，也是利用闭包访问state，然后作为参数传递给reducer
  let state = reducer(initialState);

  const listener = [];
  const subscribe = (cb) => {
    listener.push(cb);

    // 利用闭包访问`subscribe`的参数来实现退订
    return function unsubscribe() {
      const _listener = listener.slice();
      for (let i = 0; i < _listener.length; i++) {
        if (_listener[i] === cb) {
          listener.splice(i, 1);
          console.log('unsubscribed');
          return;
        }
      }
    }
  };

  const dispatch = (action) => {
    const prevState = state;
    state = reducer(state, action);

    if (prevState === state) return; // 没发生更新就取消通知

    const _listener = listener.slice();
    for (const cb of _listener) {
      cb(state);
    }
  };

  const getState = () => {
    return state;
  };

  return {
    subscribe,
    dispatch,
    getState,
  };
}

// 利用事件循环机制实现一个简单的批量更新
// 在当前任务中触发的更新保存起来，放在后面的微任务或者下一轮宏任务再更新
// 如果触发多次，表现就是最终更新一次
function useBatchUpdate(_dispatch) {
  let dispatching = false;
  let payload = {};

  return function wrap(newState) {
    // 将每次触发的state收集起来，相当于在这里先进行“更新”
    // 这样异步更新时，就是利用闭包获取最新的payload去更新state
    payload = {
      ...payload,
      ...newState,
    };

    if (dispatching) return;
    dispatching = true;

    // 在紧接的微任务里面更新
    // return Promise.resolve().then(() => {
    //   dispatching = false;
    //   _dispatch(payload);
    // });

    // 下一轮宏任务才更新
    setTimeout(() => {
      dispatching = false;
      _dispatch(payload);
    });
  }
}

const UpdateKey = 'UPDATE';
const store = createStore(
  function reducer(state = {}, action = {}) {
    switch (action.type) {
      case UpdateKey:
        return { ...state, ...action.payload };
      default: {
        return state;
      }
    }
  },
  { count: 0 },
);

const setState = useBatchUpdate(payload => store.dispatch({ type: UpdateKey, payload, }));

const unsub1 = store.subscribe((state) => {
  console.log(`update!`, state);
});

// 由于batchUpdate中使用setTimeout，所以下面四次调用只会触发一次更新
setState({ count: 1 });
console.log('第一次调用', JSON.stringify(store.getState())); // { count: 0 }

setState({ newProp: 'new-prop' });
console.log('第二次调用', JSON.stringify(store.getState())); // { count: 0 }

Promise.resolve().then(() => {
  setState({ count: 2 });
  setState({ newProp2: 'new-prop2' });
  console.log('微任务中调用', JSON.stringify(store.getState())); // { count: 0 }
});

setTimeout(() => {
  // { count: 2, newProp: 'new-prop', newProp2: 'new-prop2' }
  console.log('更新后的state', JSON.stringify(store.getState()));
  // 试试能不能退订
  unsub1();
  setState({});
});

