/**
 * 检验自己，实现promise
 * 
 * 2021-06-21
 */
const Pending = 'Pending';
const Rejected = 'Rejected';
const Fulfilled = 'Fulfilled';

function transition(instance, status, value) {
  if (instance.status !== Pending) return;
  instance.status = status;
  instance.result = value;
}

function executeCallback(handle, status, result) {
  const { onFulfilled, onRejected, resolve, reject } = handle;

  if (status === Fulfilled) {
    resolve(onFulfilled(result));
  } else {
    reject(onRejected(result));
  }
}

function resolvePromise(instance) {
  const { callbacks } = instance;
  callbacks.forEach(handle => executeCallback(handle, instance.status, instance.result));
}

class MyPromise {
  status = Pending;
  result = null;
  callbacks = [];

  constructor(executor) {
    this.status = Pending;
    this.result = null;
    this.callbacks = [];

    const onFulfilled = value => transition(this, Fulfilled, value);
    const onRejected = reason => transition(this, Rejected, reason);

    let called = false;
    const _resolve = value => {
      if (called) return;
      called = true;
      onFulfilled(value);
      resolvePromise(this);
    }
    const _reject = reason => {
      if (called) return;
      called = true;
      onRejected(reason);
      resolvePromise(this);
    }

    try {
      executor(_resolve, _reject)
    } catch (error) {
      _reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 这里的`executor`推荐使用箭头函数，不然函数内的`this`会指向新的实例
    return new MyPromise((resolve, reject) => {
      const handle = { onFulfilled, onRejected, resolve, reject };

      if (this.status === Pending) {
        this.callbacks.push(handle);
        return;
      }
      setTimeout(() => executeCallback(handle, this.status, this.result), 0);
    });
  }
}

const p = new MyPromise((resolve, reject) => {
  console.log('inner');
  resolve('resolve 1');
});
p.then((res) => {
  console.log('then 1: ', res);
}).then(res => {
  console.log('then 2: ', res);
});
p.then(res => {
  console.log('then 3: ', res);
});

const p2 = new Promise((resolve, reject) => {
  resolve('resolve 2');
});
p2.then(res => {
  console.log('then 1: ', res);
}).then(res => {
  console.log('then 2: ', res);
});
p2.then(res => {
  console.log('then 3: ', res);
})
