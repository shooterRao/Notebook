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

在 vuecli 项目中修改了`.browserlist`文件，重新编译发现体积变更不太明显，是因为`cache-loader`的原因，在`node_modules`中删除`.cache`文件，再重新编辑即可

### ts 获取枚举的 key

```ts
enum ColorsEnum {
  white = '#ffffff',
  black = '#000000',
}

type Colors = keyof typeof ColorsEnum;

const keys = Object.keys(ColorsEnum) as Array<keyof typeof ColorsEnum>;

const colorLiteral: Colors;
colorLiteral = 'white'; // OK
colorLiteral = 'black'; // OK
colorLiteral = 'red'; // Error...
```

## 三月

### 适配 iphonex+底部安全距离

如何适配 iphone 手机底部安全距离？

例如一个浮动的按钮，在使用了绝对定位或者固定定位，需要加上以下属性

```css
.btn {
  position: fixed;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  right: 16px;
  bottom: 94px;
  bottom: calc(constant(safe-area-inset-bottom) + 94px);
  bottom: calc(env(safe-area-inset-bottom) + 94px);
}
```

如果是定位底部的，例如 footer 这类的元素

```css
.footer {
  position: absolute;
  bottom: 0;
  bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  bottom: env(safe-area-inset-bottom); /* iOS 11.2 */
}
```

还有，记得在 html 文件加上

```html
<meta name="viewport" content="viewport-fit=cover" />
```

### 点击 iframe 内部无法触发外部事件的解决方案

现在有个 dropdown 组件，呈打开状态，如果点击外部区域就会自动收起，但是点击 iframe 之后，无法自动收起，原因是点击 iframe 无法触发外部层级的`document.mousedown`事件

如何解决？可以使用`window.blur`或者给 iframe 的`contentWindow.document`添加点击事件(仅限于同源情况)

window.blur 方案

```js
const onWinBlur = () => {
  if (document.activeElement === document.getElementById('office-iframe')) {
    const dropdown = this.dropdownRef;
    if (dropdown.visible) {
      dropdown.hide();
    }
  }
};

window.addEventListener('blur', onWinBlur);
```

## 四月

### 跨站

> Cookie 发送遵守的同站策略，并不是同源策略，SameSite 设为 None 则支持跨站发送(前提是开启 Secure+htttps)

什么是同站？

eTLD+1 相同即是同站

eTLD: (effective top-level domain) 有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中,如.com、.co.uk、.github.io,.top 等

eTLD+1: 有效顶级域名+二级域名，如 taobao.com,baidu.com(顶级域名是.com，二级域名是 taobao、baidu)

## 五月

### 前端异常捕获方式

1、try catch

无法捕获异步错误

2、window.onerror

可以捕获异步和同步异常，除了 promise

3、unhandledrejection

捕获未处理的 promise

4、ajax 异常

重写 XMLHttpRequest.prototype 相关方法

### 用 nginx 代理 onpremise 部署的 sentry 上报接口(https)

因为用 onpremise 部署的 sentry，只提供了 http 接口，如果在 https 应用里调用 http 接口会报`Mixed Content`问题，所以需要用 nginx 增加一层接口转发，nginx 相关配置

'https://xxx/sentry/api/xxx'转发到'http://xxx:9000/api/xxx'即可

```conf
# 忽略ssl相关配置
# 主要是下面转发配置
location /sentry/api/store/ {
  proxy_pass http://xxx:9000/api/store/;
}

location ~ /sentry/(api/[1-9]+/.*) {
  rewrite /sentry/(api/[1-9]+/.*) /$1 break;
  proxy_pass http://xxx:9000;
}
```

## 六月

### vue-class-component 初始化 data 属性的坑

如果用 vue-class-component 来写 vue 组件，初始化响应式 data 里面有值如果是 undefined，这个值将会被过滤，不会交给 vue 的 data 中，例如

```ts
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class HelloWorld extends Vue {
  // message 不是响应式的
  message = undefined;

  // message1是响应式的
  message1 = null;
}
```

看了下源码，发现 vue-class-component 里面加了这段逻辑

```ts
// create plain data object
const plainData = {};
Object.keys(data).forEach((key) => {
  if (data[key] !== undefined) {
    plainData[key] = data[key];
  }
});
```

所有 undefined 的值都被过滤了，所以不是 vue 过滤了 undefined 值，而是 vue-class-component

github 相关讨论：https://github.com/vuejs/vue-class-component/issues/39

### 处理多个条件简洁写法

```js
someFunction(str){
  if(str.includes("someValue1") || str.includes("someValue2")){
    return true
  }else{
    return false
  }
}
```

简洁的写法：

```js
someFunction(str){
  const conditions = ["someValue1", "someValue2"];
  return conditions.some(condition => str.includes(condition));
}
```

## 七月

### 使用 word-spacing 增加文字间距

如果想让'你好'展示成'你 好'，可以使用 word-spacing

注意，word-spacing 对中文无效，所以需要带上一个空格可以强行让它生效，比如'你 好'

### 替换文本指定位置函数

```ts
const replaceRangeString = (
  text: string,
  start: number,
  end: number,
  replacetext: string
) => text.substring(0, start) + replacetext + text.substring(end);
```

## 八月

### package.json 版本问题

安装了个 ui 库，里面依赖了饿了么 ui，本地开发也安装了饿了么 ui，如果希望这个 ui 用的是本地依赖的饿了么 ui，本地的饿了么版本号需要和 ui 库的依赖版本一致

ui/package.json -> element-ui(^2.15.0)
本地/package.json -> element-ui(^2.15.0)

这样就可以共用一套饿了么 ui 了，否则，ui 库下面的 node_modules 会多出个 element-ui

### 缓冲任务队列函数

```js
const queue = [];
let isFlushing = false;
function queueJob(job) {
  if (!queue.includes(job)) queue.push(job);
  if (!isFlushing) {
    isFlushing = true;
    Promise.resolve().then(() => {
      let fn;
      while ((fn = queue.shift())) {
        fn();
      }
    });
  }
}

function log1() {
  console.log(123);
}

function log2() {
  console.log(666);
}

queueJob(log1);
queueJob(log1);
queueJob(log1);

queueJob(log2);
queueJob(log2);
queueJob(log2);

isFlushing = false;
```

### 如何按需指定 node_modules/@types 下的声明文件

一般来说，node_modules/@types 下的声明文件会被自动提取，但是如果想按需指定，可以这么写

tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["node", "jest"] // 仅 node 和 jest 下的声明文件生效
  }
}
```

## 九月

### yarn link / yarn global add

在 mac 环境中，yarn link / yarn global add 会把 bin 文件软链接到 /usr/local/bin 里面


### keydown enter 问题

在 input 框中键入回车的时候，判断回车键事件来响应一些操作，比如表单提交，如果用`event.key`来判断`Enter`的话，会有些问题

在 vue 中这么写

```html
<input @keydown.enter="handleSubmit">
```

在中文输入法中，键入的时直接按回车，会触发 handleSubmit 事件

改成这种就可以解决

```html
<input @keydown.13="handleSubmit">
```

原因，中文输入法改写了 keydown 回车键的 keyCode，改成了229，所以不会触发`@keydown.13`事件
