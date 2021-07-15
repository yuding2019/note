# 虚拟列表

### 主要内容

1. 介绍虚拟列表原理
2. 原生html+js实现一个简单的虚拟滚动列表

## 虚拟列表

对页面长列表进行优化的时候，主要有两种思路

1. 分页 + 触底加载（或者手动点击加载新数据）
2. 虚拟列表

虚拟列表还是一种分页思想，两种方法最直接的区别就是虚拟列表永远只会渲染部分数据，在大数据量的情况下，可以减小dom节点的数量，同时js计算和框架提供的vdom + diff，可以保证每次我们操作的dom代价最小

在每次scroll事件触发时，动态计算滚动距离，然后计算可视区域的元素在数组中的起始与结束索引值，将数组切片，剩下的就是利用框架提供的遍历渲染将分片渲染出来就好

## 简单实现

### 准备工作

虽然是原生实现，但是考虑到为了操作简单，使用以下结构简单模拟，将数据和节点放在一起，在框架里面一般只需要操作数据就好

```typescript
interface VLNode {
  key: number; // 没用到😀
  content: string,
  host: HTMLElement,

  // 在简易的diff中，这个两个属性控制对应节点是新增还是移除
  new: boolean,
  deleted: boolean,
}
```

1. html结构

`#list-wrapper`和`#height`配合用于生成原生滚动条

```html
<div id="list-wrapper">
  <div id="height"></div>
  <ul id="list"></ul>
</div>
```

```css
#list-wrapper {
  width: 400px;
  height: 600px;
  border: 1px solid #bdc3c7;
  overflow: auto;
  margin: 0 auto;
  padding: 10px;
  list-style: none;
  position: relative;
}

#list {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  top: 0;
  left: 0;
}

#list .item {
  padding: 10px 20px;
  border: 1px solid #ff9696;
  margin: 5px 0;
}
```

2. 工具函数

简单封装三个用于操作dom的方法，`render`用于接受分片数组进行遍历，`create`用于构建新的节点并插入正确位置，`remove`用于移除可视区域外的节点

```js
window.VLElementUtils = {
  /* end控制是否在尾部插入节点 */
  create(node, parent, end = true) {
    const { content, host } = node;

    const item = host ? host : document.createElement('li');
    if (!host) {
      item.className = 'item';
      item.textContent = content;
    }
    node.host = item;

    if (end) {
      parent.appendChild(item);
      return;
    }
    const first = parent.childNodes[0];
    parent.insertBefore(item, first);
  },
  remove(node, parent, destory = false) {
    const target = node.host;
    if (target) {
      parent.removeChild(target);
    }
    if (destory) {
      node.host = null;
    }
  },
  render(nodes, parent, dir/* 1: down, -1: up */) {
    nodes.forEach(node => {
      if (node.deleted) {
        this.remove(node, parent, false);
        node.deleted = false;
        node.new = true;
        return;
      }

      if (node.new) {
        this.create(node, parent, dir === 1);
        node.new = false;
        node.deleted = false;
        return;
      }
    });
  }
}
```

3. 简易对比新旧数组节点

通过对比新旧两个分片数组将新增、移除和保留的节点进行筛选，分离成三个数组，将移除的节点`deleted`标记为`true`，然后合并三个数组交给`render`渲染

因为在`VLNode`中存在`new`，`deleted`两个属性，每次渲染（移除）节点都会进行对应的属性重置，移除的节点会将`new`标记为`true`。
这样进行diff的时候，只需要遍历新分片数组，可以新节点和将要保留的节点分开，
然后遍历旧分片数组，将不在保留数组内的节点标记为`deleted`，就算完成diff了😀

> 完整代码见`/code/virtual-list.html`

### 核心实现

这里偷懒，利用上述的html结构，可以得到一个具有原生滚动条的结构，这样我们就可以监听`#list-wrapper`的`scroll`事件

```js
let timer = 0;
listWrap.addEventListener('scroll', (e) => {
  const {
    target: { scrollTop },
    timeStamp
  } = e;
  if (scrollTop + viewHeight >= listHeight) return;
  // 这里用事件本身的timestamp做一个简单的节流
  if (timeStamp - timer < 16) return;
  time = timeStamp;

  // 根据滚动的距离计算对应的索引值
  start = ~~(scrollTop / itemHeight);
  if (start + viewItemCount >= nodes.length) {
    start = nodes.length - viewItemCount + 4;
  } else if (start <= 0) {
    start = 0;
  }
  end = start + viewItemCount;

  const newNodes = nodes.slice(start, end);
  window.VLElementUtils.render(diff(renderedNodes, newNodes, scrollDir), list, scrollDir);
  renderedNodes = newNodes;
  // 因为ul是绝对定位，为了营造出滚动的感觉，用transform来进行移动
  list.style.transform = `translateY(${scrollTop}px)`;
});
```

通过监听`wheel`事件可以判断鼠标滚轮的方向，`deltaY`大于0就行向下滚动

```js
let scrollDir = 1;
listWrap.addEventListener('wheel', (e) => {
  scrollDir = e.deltaY > 0 ? 1 : -1;
});
```

> 完整代码见`/code/virtual-list.html`

> ##
> ### 如有错误，欢迎批评指正
> ##
