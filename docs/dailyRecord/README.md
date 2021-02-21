# 2021

## 一月

### ts 非空断言操作符

在 ts 中，使用`!`可以用于断言操作对象是非`null`和非`undefined`类型

举个例子

```ts
function foo(bar: string | undefined | null) {
  const str: string = bar; // 报错
  const str1: string = bar!; // 解决
}

type GenString = () => string;

function genString(fn: GenString | undefined) {
  const str = fn();
  const str1 = fn!();
}
```

还有一种确定赋值断言

```ts
let x!: number;
init();

// 如果上面x不加 ! 就会error;
console.log(x);

function init() {
  x = 100;
}
```

### ts 空值合并运算符

ts 使用`??`作为空值合并运算符，当左侧操作数为 null 或 undefined 时，则返回右侧的操作数，否则返回左侧的操作数

这是为了解决这种情况

```ts
const foo = 0 || 1; // 1
const bar = 0 ?? 1; // 0
const falsy = false ?? true; // false
```

### nginx 中 root 和 alias 的区别

`root`和`alias`最主要的区别是如何解析**location**后面的**url**

`alias`仅用于目录别名的定义，仅能用于**location**上下文，`root`则可以用于最上层目录的定义

比如定义一个**location**

```
location /nginx {
  root /data/www;
  index index.html
}
```

这样当你访问`http://location/nginx`，nginx 会去`/data/www/nginx`去找`index.html`，即`/data/www/nginx/index.html`

如果使用 alias

```
location /nginx {
  alias /data/www;
  index index.html
}
```

当访问`http://location/nginx`，nginx 会去`/data/www`去找`index.html`，即`/data/www/index.html`

### axios 网络异常重发请求简单实现

在使用 axios 时，网络请求发生异常，或者说网络突然断线的情况下，如何实现重发请求呢？

可以用 axios 的拦截器进行简单实现，下面是实现过程

```js
const namespace = 'retry';

const retryOpts = {
  retryCount: 3, // 断线重连次数
  delay: 200, // 延迟时间
};

// 每个请求config都是独立的，所以可以把一些参数缓存到config里面
function getCurrentState(config) {
  const currentState = config[namespace] || {};
  currentState.retryCount = currentState.retryCount || 0;
  config[namespace] = currentState;
  return currentState;
}

function retry(axios, options = retryOpts) {
  axios.interceptors.request.use((config) => {
    const currentState = getCurrentState(config);
    currentState.lastRequestTime = Date.now();
    return config;
  });

  axios.interceptors.response.use(null, (error) => {
    const { config } = error;

    if (config[namespace].retryCount < options.retryCount) {
      config[namespace].retryCount += 1;
      // 重发请求
      return new Promise((resolve) =>
        setTimeout(() => resolve(axios(config)), options.delay)
      );
    }

    return Promise.reject(error.config);
  });
}

const client = axios.create();
retry(client);

client.get('http://localhost:3000/get').catch((errConfig) => {
  console.log(errConfig);
});
```

### ts 中 omit 的用法

omit 主要是用于省略对象的某些 key

```ts
interface User {
  id: number;
  age: number;
  name: string;
}

type OmitUser = Omit<User, 'id'>;

// 相当于 type OmitUser = { age: number; name: string; }
```

### mac 关闭端口的方法

比如要关闭本地 9000 端口

```
lsof -i :9000
```

查到 PID

然后关闭端口

```
kill -9 PID
```

### 移动端 1px scss 函数

```scss
/**
 * 解决移动端1px问题
*/
@mixin mobileThinBorder(
  $directionMaps: bottom,
  $color: $m-color-4,
  $position: after
) {
  // 是否只有一个方向
  $isOnlyOneDir: string==type-of($directionMaps);

  @if ($isOnlyOneDir) {
    $directionMaps: ($directionMaps);
  }

  @each $directionMap in $directionMaps {
    border-#{$directionMap}: 1px solid $color;
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 2) {
    & {
      position: relative;

      // 删除1像素密度比下的边框
      @each $directionMap in $directionMaps {
        border-#{$directionMap}: none;
      }
    }

    &:#{$position} {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      box-sizing: border-box;
      padding: 1px;
      transform-origin: 0 0;
      pointer-events: none;
      border: 0 solid $color;

      @each $directionMap in $directionMaps {
        border-#{$directionMap}-width: 1px;
      }
    }
  }

  @media only screen and (min-device-pixel-ratio: 3),
    (-webkit-min-device-pixel-ratio: 3) {
    &:#{$position} {
      width: 300%;
      height: 300%;
      transform: scale(0.333333);
    }
  }
}
```

### vue-cli 配置 process.env.BASE_URL 注意点

普通`vue-router`配置方式

```js
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
```

里面的`process.env.BASE_URL`是什么？

如果你不在`vue.config.js`中指定`publicPath`，就是默认`/`，否则就会拿`publicPath`的值注入到`process.env.BASE_URL`里

### 去除移动端 webkit 内核浏览器点击背景阴影

```css
div {
  -webkit-tap-highlight-color: transparent;
}
```

### 安卓输入法弹起底部解决方案

```js
const ua = window.navigator.userAgent.toLocaleLowerCase();
const isAndroid = /android/.test(ua);

const originHeight =
  document.documentElement.clientHeight || document.body.clientHeight;

window.addEventListener(
  'resize',
  function() {
    const resizeHeight =
      document.documentElement.clientHeight || document.body.clientHeight;

    if (resizeHeight < originHeight) {
      console.log('Android 键盘弹起...');
      // 底部被顶起了，视口高度变小，做些什么...
    } else {
      console.log('Android 键盘收起...');
      // 视口高度恢复正常，做些什么...
    }
  },
  false
);
```

## 二月

### fixed 布局

在做项目的时候，使用了 fixed 布局，设置 top 为 0，bottom 为 0 时，高度没有占满，去看了下 MDN 文档，发现有个细节

> 元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform, perspective 或 filter 属性非 none 时，容器由视口改为该祖先。

看最后一句话，很重要，原来 fixed 布局也会改变容器的对象，因为在项目中，fixed 元素的父元素使用了 transform，改变了容器对象，所以高度没有占满窗口

### 修改 .browserlist 不生效的问题

在vuecli项目中修改了`.browserlist`文件，重新编译发现体积变更不太明显，是因为`cache-loader`的原因，在`node_modules`中删除`.cache`文件，再重新编辑即可

