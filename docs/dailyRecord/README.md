# 2020

## 一月

### 运行时设置 webpack 的 publicPath

`publicPath` 是 webpack 提供的配置公共路径的地方，可以通过它来指定应用程序中所有资源的基础路径，如果我们想要运行时设置`publicPath`，可以通过动态设置`__webpack_public_path__`来实现

在`app.js`中：

```js
__webpack_public_path__ = '/public/';

// 打包后对应的变量名
__webpack_require__.p = '/public/';
```

在打包后，会有一个`__webpack_require__.p`变量来保存最新设置的值

## 二月

### 大文件上传切片方法

前端上传打文件的时候，一般都会用切片上传的方式，核心主要是用`Blob.prototype.slice`进行切片，这个方法可以返回一个新的切片`Blob`对象，前端处理这么写：

```js
function createFileChunk(file, size = 1 * 1024 * 1024) {
  const fileChunkList = [];
  let cur = 0;
  while (cur < file.size) {
    fileChunkList.push({
      // 利用 Blob.prototype.slice 切片
      file: file.slice(cur, cur + size),
    });
    cur += size;
  }
  return fileChunkList;
}
```

### JavaScript 判断整型的方法

es5：

```js
function isInteger(x) {
  return parseInt(x, 10) === x;
}
```

es6：

```js
function isInteger(x) {
  return Number.isInteger(x);
}
```

### 如何在 html 上实现重定向？

使用`meta content url`方法，`http-equiv="refresh"`定义文档自动刷新的时间间隔(多少秒)，设置在`content`里`url`的前面

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;url=xxx" />
  </head>
  <body></body>
</html>
```

## 三月

### docker nginx 容器如何访问宿主机

在用 docker nginx 进行反向代理本地一些服务的时候，默认用 localhost 是直接访问容器的本身，所以要在 nginx 的 conf 文件中配置指定的 ip 地址，但是网络切换的话，ip 会变，所以只能修改配置文件进行重启这个容器，其实不方便，那么有什么办法可以省去这步骤呢？

- 在 mac desktop 环境中，可以用`host.docker.internal`来获取到宿主机的 ip 地址
- 在 linux 环境中，可以`--network host`模式启动容器

在 mac 环境中，nginx 的 conf 文件中可以这么写了：

```
location / {
  proxy_pass http://host.docker.internal:5505/;
}
```

### vscode vue 文件中无法识别"@/xxx"文件路径

使用 `jsconfig.json` 解决

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "g6/*": ["./src/g6/*"]
    },
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 使用对象填充数组

```js
const length = 3;
const resultA = Array.from({ length }, () => ({}));
const resultB = Array(length).fill({});

resultA; // => [{}, {}, {}]
resultB; // => [{}, {}, {}]

resultA[0] === resultA[1]; // => false
resultB[0] === resultB[1]; // => true
```

由此可见，用`Array.from`比`fill`方法更好，可以避免由于相同对象引起的一些麻烦。

## 四月

### 如何设计一个同时支持具名插槽和默认插槽的 vue 组件

如果想要开发一个同时支持具体插槽和默认插槽的 vue 组件，关键在于如何判断组件是否使用了默认插槽，也就是加个判断：

```js
computed: {
  hasSlotDefault() {
    // 组件内如果没内容，$slots.default 为 undefined
    return !!this.$slots.default;
  }
},
```

模板写法：

```html
<div class="project-main">
  <template v-if="!hasSlotDefault">
    <div class="menu">
      <slot name="menu"></slot>
    </div>
    <div class="module">
      <slot name="module"></slot>
    </div>
  </template>
  <template v-else>
    <slot></slot>
  </template>
</div>
```

### 如何在 .eslintrc.js 中配置 prettier 规则

```js
rules: {
  'prettier/prettier': ['error', { singleQuote: true }]
}
```

### 使用 emoji 设置 网页的 favicon 的方法

```js
const setFavicon = function(url) {
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = url;
  } else {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;

    document.head.appendChild(link);
  }
};

const emojiFavicon = function(emoji) {
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;

  const context = canvas.getContext('2d');
  context.font = '64px serif';
  context.fillText(emoji, 0, 64);

  const url = canvas.toDataURL();

  setFavicon(url);
};

// Usage
emojiFavicon('🎉');
```

### 计算 scrollbar 宽度的方法

```js
const calculateScrollbarWidth = function() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';

  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  // 里外宽度相减得出滚动条的宽度
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  document.body.removeChild(outer);

  return scrollbarWidth;
};
```

### pipe-promise

跟 compose 函数用法类似，只不过 compose 函数是从右到左执行，链式，按顺序调用 promise 函数

```js
const pipe = (...functions) => (input) =>
  functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));
```

## 五月

### iview Modal 组件 slot 重渲染

iview Modal 组件关闭后再打开内部插槽组件是不会重新渲染的，如果要重渲染，如何实现？下面是二次封装 Modal 组件解决方式的一些代码片段：

```vue
<template>
  <Modal v-model="show" v-bind="$attrs" v-on="$listeners">
    <template v-if="slotRerender">
      <slot v-if="showSlot"></slot>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </Modal>
</template>

<script>
export default {
  watch: {
    async value(n) {
      if (n === true) {
        this.showSlot = !n;
        await this.$nextTick();
        this.show = n;
        this.showSlot = n;
      } else {
        this.show = n;
      }
    },
  },
};
</script>
```

### 如何用 this.\\\$xxx 方式挂载 vue 组件

比如我这边有个基于 iview modal 封装的弹窗组件 ErsConfirm，用普通的模板写法就是这样的

```html
<ErsConfirm
  v-model="modal1"
  title="删除"
  confirm-info="确定要删除该项目吗？"
  @on-confirm="ok"
  @on-close="cancel"
/>
```

如果在业务逻辑中存在多个询问弹窗层，写大量模板是比较难受的事情，代码也比较冗余，所以需要用 js 命令式的方式进行组件挂载，这样看起来就优雅得多，下面是实现过程：

```js
import Vue from 'vue';
import ErsConfirm from './ErsConfirm/ErsConfirm.vue';

// Vue.use()
export default function(Vue) {
  Vue.prototype.$ErsConfirm = createErsConfirm;
}

function createErsConfirm(options = {}) {
  const instance = ErsConfirm.newInstance(options);
  instance.show();
}

// 拿属性，不拿方法
function getAttrs(props) {
  return Object.keys(props).reduce((pre, cur) => {
    if (typeof props[cur] !== 'function') {
      pre[cur] = props[cur];
    }
    return pre;
  }, {});
}

function noop() {}

ErsConfirm.newInstance = (props) => {
  const { onConfirm, onClose } = props;
  const attrs = getAttrs(props);
  const instance = new Vue({
    inheritAttrs: false,
    data: {
      visible: false,
    },
    methods: {
      change(value) {
        if (value === false) {
          this.remove();
        }
      },
      remove() {
        setTimeout(() => {
          this.destroy();
        }, 300);
      },
      destroy() {
        this.$destroy();
        if (this.$el) {
          document.body.removeChild(this.$el);
          this.$el = null;
        }
      },
    },
    render() {
      return (
        <ErsConfirm
          value={this.visible}
          on-input={this.change}
          {...{
            attrs,
            on: {
              'on-confirm': onConfirm || noop,
              'on-close': onClose || noop,
            },
          }}
        />
      );
    },
  });

  const component = instance.$mount();
  document.body.appendChild(component.$el);

  return {
    show() {
      instance.visible = true;
    },
  };
};
```

安装插件

```js
import $ErsConfirm from './$ErsConfirm';
Vue.use($ErsConfirm);
```

这样，就可以用 this.\\\$ErsConfirm 方式来使用了该组件了

```js
this.$ErsConfirm({
  title: '删除',
  confirmInfo: '确定要删除该项目吗？',
  onConfirm: () => {
    console.log('confirm');
  },
  onClose: () => {
    console.log('close');
  },
});
```

## 六月

### typeScript 中的元组

元组即 h 为合并了多种类型的数组，用于定义具有有限数量的未命名属性的类型

比如这么使用：

```typeScript
const tuple: [number, string, boolean] = [0, '1', true];
```

预先声明了什么类型，都需要提供对应的值

### yarn link 出现 permission denied

在本地`mac`开发环境中，`yarn link`之后如果可能会遇到`permission denied`问题，可参考这个[issue](https://github.com/yarnpkg/yarn/issues/3587)

解决方法就是需要使用`chmod +x`+你的`bin`文件中的`index.js`开启可执行权限，例如你的文件在`xxx/cli/bin/index.js`中，则使用`chmod +x xxx/cli/bin/index.js`就可以了

### Object.is polyfill

```js
if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
```

### yarn link 之后可执行命令存在哪里

存在了`/usr/local/bin`目录下

## 七月

### 转译函数

```js
// Security helper :)
function EscapeHtml() {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => {
    return map[m];
  });
}
```

### nodejs 一些路径变量

最近在写脚手架，记录些路径变量

```js
console.log(__dirname); // 当前文件执行路径
console.log(process.cwd()); // 当前程序运行路径，也就是在哪开始 node xxx 的

// path.resolve() 方法可以将多个路径解析为一个规范化的绝对路径
// path.join() 方法可以连接任意多个路径字符串
// 注意，path这些api并不会使用文件系统来判断该路径合不合法，只是单纯的处理'./'和'/'
```

### 模块重定向

如果我们想要在当前模块中，导出指定导入模块的默认导出（等于是创建了一个“重定向”）：

```js
import A from "./A.vue';
export default A;

// 其实是可以用模块重定向简写的
export { default } from "./A.vue";

// 如果模块有多个导出，可以这么做
export * from './other-module';
```

### ts 使用 fs.promises

使用 node 自带`fs.promises`模块，可以不需要`fs-extra`了

```js
import { promises as fs } from 'fs';
```

### 查看远程 npm 包最新版本

最近脚手架做了个检测更新的功能，需要检测远程 npm 包的版本，和本地进行对比，获得 npm 包最新版本有以下几种方法：

第一种，直接用 npm 自带脚本

```
npm show xxx version
```

第二种，使用第三方库[latest-version](https://github.com/sindresorhus/latest-version#readme)进行检测

### docker nginx 容器 hjson 中文乱码

linux 下采用 utf-8 编码，默认情况下我们的浏览器在服务器没有指定编码或者静态页面没有声明编码的情况下会以 gbk 的编码去渲染页面，这样默认情况下返回中文的话浏览器用 gbk 来解析 utf-8 编码，会出现乱码，解决方法如下：

在 server 配置中增加

```
server {
  add_header Content-Type 'text/html; charset=utf-8';
}
```

这种主要是解决 network 中 previvew 中乱码，在页面上显示还是正常的，因为页面本来就指定了 utf-8 编码

### 获取项目部署路径

```js
// 默认获取第一层
// 看"/"在哪，取到哪，从0开始数起
const getAbsolutePath = (level = 1) => {
  const path = window.location.pathname;

  let numDirsProcessed = 0;
  let start = 0;

  if (path.length === 1) {
    return path;
  }

  if (level === 0) {
    return '/';
  }

  while (numDirsProcessed !== level) {
    const char = path[++start];
    if (char === '/') {
      numDirsProcessed++;
    }

    if (!char) {
      return '/';
    }
  }

  return path.slice(0, start + 1);
};

const getDeployPath = (level) => {
  return window.location.origin + getAbsolutePath(level);
};
```

### nodejs 判断文件或者目录是否存在的

```js
//
function pathExists(path) {
  return fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);
}
```

### nodejs 集体导出模块的方法

合并到`exports`对象上即可，参考了`@vue/cli-shared-utils`源码

```js
[
  'env',
  'exit',
  'ipc',
  'logger',
  'module',
  'object',
  'openBrowser',
  'pkg',
  'pluginResolution',
  'launch',
  'request',
  'spinner',
  'validate',
].forEach((m) => {
  Object.assign(exports, require(`./lib/${m}`));
});
```

## 八月

### docker 如何不使用缓存重建镜像

docker 在重建镜像的时候，会优先使用缓存进行构建，但是有些情况不能使用缓存构建，比如前端代码拉取打包这些，如何用了缓存生成代码就不能更新，所以需要解决这个问题

`docker build --no-cache .`

构建时带上`--no-cache`即可

### 判断空对象的方法

```js
function checkObjectEmpty(value) {
  return (
    value && Object.keys(value).length === 0 && value.constructor === Object
  );
}
```

为什么要加`value.constructor === Object`的判断？

如果不加，参数输入以下这几种均为`true`:

```js
checkObjectEmpty(new String()); // true
checkObjectEmpty(new Number()); // true
checkObjectEmpty(new Boolean()); // true
checkObjectEmpty(new Array()); // true
checkObjectEmpty(new RegExp()); // true
checkObjectEmpty(new Function()); // true
checkObjectEmpty(new Date()); // true
```

实际上，我们只检测`new Object()`而不包括上面这种构造函数的实例

还有，增加 value 是否存在的判断，是为了过滤`null`和`undefined`，避免报 error

### ES6 判断 2 个对象是否相等

```js
const o1 = { fruit: 'apple' };
const o2 = { fruit: 'apple' };

Object.entries(o1).toString() === Object.entries(o2).toString(); // true
```

### 过滤对象某个 key 值

```js
const food = { meat: '🥩', broccoli: '🥦', carrot: '🥕' };

function filterObjectKey(obj, k) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => key !== k)
  );
}

filterObjectKey(food, 'meat');
// { broccoli: '🥦', carrot: '🥕' }
```

### babel 是怎么实现 const 和 let 块级作用域的

在 ES6 中，const 和 let 声明变量只会在代码块中有效，但是在 ES5 中是没有的，那 babel 是怎么实现的呢？

其实 babel 是通过编译时实现的，而非运行时实现，比如：

```js
if (true) {
  const content = ``;
  console.log(content);
}
console.log(content);
```

编译后：

```js
if (true) {
  var _content = '';
  console.log(_content);
}
console.log(content);
```

可以看到，块级内的`content`变量被编译成`_content`，块级外面的`content`则没被编译，这样就实现了块级作用域化

那老生常谈的 for 循环中的 let 块级作用域的实现呢，因为单纯靠改变变量名是实现不了的，比如`for (var i = 0; i < 10; i++)`和`for (var _i = 0; _i < 10; _i++)`是一样的，babel 的实现是这样的：

```js
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
```

编译后：

```js
var a = [];

var _loop = function _loop(i) {
  a[i] = function() {
    console.log(i);
  };
};

for (var i = 0; i < 10; i++) {
  _loop(i);
}
```

可以看到，babel 的实现方式是增加一个`_loop`函数，每次循环都执行一次`_loop`函数，把变量保存在**闭包**里面，这样读取的就不是全局变量 i 了

### ts get 函数正确写法

```ts
const obj = {
  name: 'obj',
  value: 666,
};

function get(obj: object, key: string) {
  return obj[key];
}
```

这种写法是有问题的，ts 无法推断返回值的类型，也无法对 key 值进行约束

正确的写法，关键在于`keyof`的使用

```ts
function get<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### nodejs 拉取远端图片保存本地基础写法

`http`模块请求方式

```js
function fetchFile() {
  http.get(`xxx.jpg`, function(stream) {
    const chunks = [];
    let res = null;
    stream.on('data', function(chunk) {
      chunks.push(chunk);
    });

    stream.on('end', function(chunk) {
      res = Buffer.concat(chunks);

      fs.writeFile('xxx.jpg', res);
    });
  });
}
```

`axios`请求方式

```js
axios
  .get(`xxx.jpg`, {
    // 注重要指定 responseType 为 "arraybuffer"
    // 不然默认返回的是Buffer.toString()
    // 这样保存图片就会有问题
    responseType: 'arraybuffer',
  })
  .then((res) => fs.writeFileSync('xxx.jpg', res.data));
```

`axios`源码写法如下

```js
stream.on('end', function handleStreamEnd() {
  var responseData = Buffer.concat(responseBuffer);
  if (config.responseType !== 'arraybuffer') {
    responseData = responseData.toString(config.responseEncoding);
  }

  response.data = responseData;
  settle(resolve, reject, response);
});
```

所以使用`axios`请求图片流时需要声明`responseType`为`"arraybuffer"`

## 九月

### 浏览器如何检测系统主题色

在较新的浏览器中，可以使用`prefers-color-scheme`CSS 媒体查询来检测系统主题色为`light`或者是`dark`

```css
@media (prefers-color-scheme: dark) {
  .day.dark-scheme {
    background: #333;
    color: white;
  }
  .night.dark-scheme {
    background: black;
    color: #ddd;
  }
}

@media (prefers-color-scheme: light) {
  .day.light-scheme {
    background: white;
    color: #555;
  }
  .night.light-scheme {
    background: #eee;
    color: black;
  }
}
```

那在`js`中如何检测呢？还是有方法的，使用`window.matchMedia`来检测

```js
const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
const lightMode = window.matchMedia('(prefers-color-scheme: light)');
console.log(darkMode);
console.log(lightMode);
```

### 前端如何下载 base64 字符串图片

前端想下载图片，如果后端返回了`base64`字符，没有返回文件流的话，改如何实现下载？

首先要把 base64 字符串转 blob

```js
function base64ToBlob(base64, type) {
  const byteCharacters = atob(base64); // 解码
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const buffer = Uint8Array.from(byteNumbers);
  const blob = new Blob([buffer], { type });
  return blob;
}
```

然后再把`blob`转成`blob:URL`, a 标签下载`blob:URL`即可

```js
function downloadBlob(blob) {
  const aTag = document.createElement('a');
  aTag.download = '';
  const blobUrl = URL.createObjectURL(blob);
  aTag.href = blobUrl;
  aTag.click();
  URL.revokeObjectURL(blobUrl);
}
```

### 生成区间的随机数

```js
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### chrome 开启 pause on exceptions

在`sources`面板中可以开启`pause on exceptions`功能，这个功能可以在代码出现异常的自动打上断点，可以很方便的排查未捕获错误发生的位置。

## 十月

### 查看项目 node_modules 文件夹大小

unix 和 linux 系统使用`du -hd 0 node_modules`即可

`du -hd 1 node_modules`可以查看里面每个文件夹的文件大小

### vue-devtool 无法显示使用 `$mount` 动态挂载的组件解决方法

类似这种情况

```html
<div id="app">
  <span id="component"></span>
</div>

<script>
  const root = new Vue().$mount('#app');

  const MyComponent = Vue.extend({ name: 'component' });
  new MyComponent().$mount('#component'); // 动态挂载组件
</script>
```

可以看到 id 为`component`的组件是动态挂载上去的，这种情况在**vue-devtool**中无法显示这个子组件，只会显示`root`组件，为什么呢？主要是动态挂载的组件和 root 组件没有形成父子关系，因为 vue 已经初始化完成，所以需要手动声明下他们的父子关系，解决方法如下：

```js
const MyComponent = Vue.extend({ name: 'component' });
new MyComponent({
  parent: root, // 声明父子关系
}).$mount('#component');

// 或者用这种方法也行
MyComponent.$parent = root;
root.$children.push(MyComponent);
```

### 本地图片预览

本地图片预览，在 type 为 file 的 input 标签上传触发 onchange 事件发生后，使用 FileReader 即可实现

一种是使用`data:URL`base64 展示，不过这种长度浏览器有限制

```js
const reader = new FileReader();
reader.onload = function() {
  const output = document.querySelector('#preview');
  output.src = reader.result;
};
reader.readAsDataURL(file);
```

另一种是使用`blob:URL`

```js
const reader = new FileReader();
reader.onload = function() {
  const output = document.querySelector('#preview');
  const blob = new Blob([reader.result], { type: 'image/png' });
  const blobUrl = URL.createObjectURL(blob);
  output.src = blobUrl;
  queueMicrotask(() => URL.revokeObjectURL(blobUrl)); // 异步 revoke
};
reader.readAsArrayBuffer(file);
```

### nginx 开启负载均衡

使用`proxy_pass`和`upstream`可以开启负载均衡

```
http {
  upstream site {
    server 192.168.0.1;
    server 192.168.0.2;
    server 192.168.0.3;
  }

  server {
    listen 80;
    location / {
      proxy_pass http://site;
    }
  }
}
```

负载均衡有4种模式

- 轮询

默认使用的方式，按服务器配置节点顺序轮询

- 加权轮询

```
upstream site {
  server 192.168.0.1 weight=1;
  server 192.168.0.2 weight=2;
  server 192.168.0.3 weight=3;
}
```

- ip_hash

对ip地址进行hash，这样用户就会在固定的服务器上请求，利于缓存和进行接口测试

```
upstream site {
  server 192.168.0.1;
  server 192.168.0.2;
  server 192.168.0.3;
  ip_hash;
}
```

- least_conn;

优先选择连接数量最少的服务器负载

```
upstream site {
  server 192.168.0.1;
  server 192.168.0.2;
  server 192.168.0.3;
  least_conn;
}
```

<ToTop/>
