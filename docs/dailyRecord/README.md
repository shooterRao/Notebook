# 2019

## 一月

### 利用 Coverage 检测可以懒加载的 modules

1、打开 devTools，按`Ctrl+shift+p`，mac(`cmd+shift+p`)，输入`Coverage`，选`Drawer: Coverage`

2、reload

3、可以看到哪些 modules 可以用`import()`懒加载了

### nginx vue history 爬坑

按照官方`nginx`的参考配置：

```bash
location / {
  try_files $uri $uri/ /index.html;
}
```

如果是项目在根目录倒没啥问题，但如果项目在 xxx 路径下，比如在`http://ip/vue/`路径下，点击跳转到路由`http://ip/vue/about`下是 ok 的，但是一刷新页面，你会发现就不好使了。原因很简单，就在上面的配置中:

`try_files $uri $uri/ /index.html` => `http://ip/vue/about/index.html`

所以，这种情况正确的操作是：

```bash
location /vue/ {
  try_files $uri $uri/ /vue/index.html;# 全部跳回到vue/index.html页面中
}
```

注意， `/vue/`实际上你上面配的`root`下的 vue 文件夹，比如你的`root`是`/app`，`location /vue/`即为 `location /app/vue/`

### iview menu 组件无法高亮展开问题

在 iview Menu 组件中，如果数据是异步请求的，动态设置`activeName`、`openNames`会不生效，原因是 activeName、或者 openNames 这些优先告诉 Menu 组件了，挂载时(menuData 还没获取到)就已经确定好这些状态，就算是 menuData 获取到了，也不会触发 setter 进行页面状态更新

**解决方案**

方案 1：

```js
// 利用watch
watch() {
  // 异步获取数据更新时，需要进行高亮、展开节点更新
  menuData() {
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName();
      this.$refs.menu.updateOpened();
    });
  },
  activeName(value) {
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName();
    });
  },
  openNames(value) {
    this.$nextTick(() => {
      this.$refs.menu.updateOpened();
    });
  }
}
```

方案 2：

`<Menu v-if="menuData.length !== 0"/>`

### 滚动进度条核心代码

::: tip 原理
视口滚动的距离 / (文档总高度 - 视口高度)
:::

```js
// jq
($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;

// js
const { scrollTop, scrollHeight, clientHeight } = document.scrollingElement;
(scrollTop / (scrollHeight - clientHeight)) * 100;
```

## 二月

### vue jsx 使用全局组件

在 vue jsx 中只能使用`(kebab-case)`的全局组件，不能使用`(PascalCase)`，如果要使用`(PascalCase)`，可以这么写

```js
render (h) {
  const { Tabs, TabPane } = this.$options.components;
  return (
    <Tabs>
      <TabPane></TabPane>
    </Tabs>
  )
}
```

### tomcat 开启 gzip 配置

在`conf/server.xml`文件中进行配置

```xml
<Connector  port="8088"
            protocol="HTTP/1.1"
            connectionTimeout="20000"
            redirectPort="8443" URIEncoding="utf-8"
	          useSendfile="false"
            compression="on"
            compressionMinSize="50"
            noCompressionUserAgents="gozilla,traviata"
            compressableMimeType="text/html,text/xml,text/javascript,application/x-javascript,application/javascript,text/css,text/plain"
/>
```

## 三月

### vue v-model 细节

`v-model` 在内部使用不同的属性为不同的输入元素并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件
- checkbox 和 radio 使用 checked 属性和 change 事件
- select 字段将 value 作为 prop 并将 change 作为事件

### js 找出数组最大最小值

```js
const getMaxNumber = array => Math.max(...array);
const getMinNumber = array => Math.min(...array);
```

### vue 强迫重新渲染

```js
Vue.component("comp", {
  created() {
    console.log("被重新渲染了");
  },
  render(h) {
    return h("span", "组件");
  }
});
const app = new Vue({
  el: "#app",
  data: {
    key: 0
  },
  methods: {
    update() {
      this.key++;
    }
  },
  render(h) {
    const vm = this;
    return h("div", [
      h("comp", {
        key: vm.key
      }),
      h(
        "button",
        {
          on: {
            click: function() {
              vm.update();
            }
          }
        },
        "刷新"
      )
    ]);
  }
});
```

### vue 路由跳转重渲染

比如，在点击菜单切换，在父组件中会进行`$router.push({name: xxx, query: xxx})`切换子路由页面(同一个组件)，子路由页面会获取相关路由参数进行数据请求，但是 vue-router 会默认**同一组件不重复实例化**，所以我们有 2 种方法：

1、子路由`watch: $route`，然后进行相关请求逻辑

2、每次跳转路由(即使是同一个)都强制重刷新

第一种方法经常用了，这里不再详叙。根据上个笔记的启发，我们可以通过如下写法轻松实现强制组件重渲染

```html
<router-view :key="$route.fullPath" />
```

注意，组件渲染量少的话可以使用，如果组件很重，还是建议使用第一种方法

## 四月

### echarts 平均值 toolTip 的问题

在 echarts 默认出现的 toolTip 中，可能会出现`null`等奇怪的东西出来，需要用 formatter 解决

```js
const option = {
  tooltip: {
    formatter(params) {
      // marker 是小圆点
      const { color, marker, name, value } = params;
      if (typeof color === "string") {
        return `${marker}${name}: ${value}`;
      }
      return `${name}: ${value}`;
    }
  }
};
```

### vue 中 self 事件修饰符

`.self` 事件修饰符实际等于 `if (event.target !== event.currentTarget) return`

### 正则过滤 "./index.js" 文件

`/\.\/(?!index\.)\w*\.js$/.test("./index.js")`

### form 表单中 button 的坑

在`form`表单中，如果含有`button`按钮标签，点击则会重载页面，原因是因为在浏览器中，`button`的`type`属性会有默认值，w3c 标准如下：

> 请始终为按钮规定 type 属性。Internet Explorer 的默认类型是 "button"，而其他浏览器中（包括 W3C 规范）的默认值是 "submit"。

`type`属性为`submit`时会在表单中触发重载页面，所以指定 `type` 属性为 `button`即可

在 form 表单中，应该用`input`标签来创建按钮

### cached 函数

该函数一般用于**缓存比较耗时**的函数，主要利用闭包进行实现

```js
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

const fn = cached(function(str) {
  let i = 10000;
  while (i--) {}
  return str;
});

console.time("test1");
fn(1); // 2.9ms
console.timeEnd("test1");

console.time("test2");
fn(1); // 0.005ms // 第一次被缓存，所以非常快
console.timeEnd("test2");
```

### yarn 升级指定包

yarn upgrade-interactive --latest

### 关于 vue button 组件的小坑

自己封装了一个`button`组件

```js
const button = {
  name: 'Button',
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
  render(h) {
    return h('button', {
      on: {
        click: () => {
          this.handleClick();
        }
      }
    }, this.$slots.default)
  }
}
```

使用

<Button @click.stop.prevent="handleClick">按钮</Button>

这种情况下，是会报找不到 Cannot read property 'stopPropagation' of undefined 这种错

解决方案是 把 event 对象传出去即可

```js
render(h) {
    return h('button', {
      on: {
        click: (event) => {
          this.handleClick(event);
        }
      }
    }, this.$slots.default)
  }
```

## 五月

### let、const、function、class 在 switch 中作用域问题

::: tip 原理
词法声明在整个 switch 语句块中是可见的，但是它只有在运行到它定义的 case 语句时，才会进行初始化操作
:::

错误示例：

```js
switch (foo) {
  case 1:
    let x = 1;
    break;
  case 2:
    const y = 2;
    break;
  case 3:
    function f() {}
    break;
  default:
    class C {}
}
```

正确示例：

```js
switch (foo) {
  case 1: {
    let x = 1;
    break;
  }
  case 2: {
    const y = 2;
    break;
  }
  case 3: {
    function f() {}
    break;
  }
  case 4:
    var z = 4;
    break;
  default: {
    class C {}
  }
}
```

### 输入框 input、change 事件的区别

::: tip MDN文档
> 与 input 事件不同，change 事件不一定会对元素值的每次更改触发
:::

也就是说，输入框`change`事件是在输入值时失去焦点或者按回车才会触发，`input`事件在输入时就会触发

但是在**react**中，这两者是一样的，可以在这看看[原因](https://stackoverflow.com/questions/38256332/in-react-whats-the-difference-between-onchange-and-oninput)


### webpack HMR 原理

步骤：

1. webpack 对文件系统进行 watch 打包到内存中
2. devServer 通知浏览器端文件发生改变
3. webpack-dev-server/client 接收到服务端消息做出响应
4. webpack 接收到最新 hash 值验证并请求模块代码
5. HotModuleReplacement.runtime 对模块进行热更新
6. 业务模块调用 HMR 的 accept 方法，添加模块更新后的回调函数

参考一个大佬写的[文章](https://zhuanlan.zhihu.com/p/30669007)

### Function.length

`Function.length` 表示函数形参的个数

```js
console.log(Function.length); // 1

console.log((function() {}).length); // 0

console.log((function(a, b) {}).length); // 2

console.log((function(a, b = 1, c) {}).length); // 1

console.log((function(a, b, c = 1) {}).length); // 2
```

### js 变量私有化

利用闭包

```js
function Person () {
  // name变量私有化
  const name = "l";
  
  this.getName = function() {
    return name;
  }

  this.setName = function(newName) {
    name = newName
  }
}

// test
const p = new Person();
console.log(p.name); // undefined
console.log(p.getName()); // "l"
```

### vuecli3 使用 webpack-bundle-analyzer

vue-config.js 加入以下几句代码：

```js
module.exports = {
  chainWebpack: config => {
    // npm xxx --report 这里 npm config 会识别到
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
}
```

然后 `npm run build --report` 即可

注意，如果用 `yarn` 的话 `npm_config_report` 会无法识别

### @babel/plugin-transform-runtime 使用

这个插件有什么用？

::: tip 文档原文
> A plugin that enables the re-use of Babel's injected helper code to save on codesize.
:::

也就是可以把重复的babel-helper代码抽离出来，减少重复的代码

安装

```shell
yarn add @babel/plugin-transform-runtime -D

yarn add @babel/runtime
```

使用 babel.config.js

```js
module.exports = {
  plugins: ["@babel/plugin-transform-runtime"]
}
```

**使用插件前的代码测试**

测试 `async/await`

```js
async () => {
  await Promise.resolve();
}
```

使用 `@babel/preset-env` 后，为了支持 `async/await`，会在代码加入下面几个函数

```js
function asyncGeneratorStep() { 
  // 很长，省略
}

function _asyncToGenerator(fn) { 
  // 很长，省略
}

// 开始转译 async/await ...
```

这些每个有 `async/await` 的地方，都有上面2个 helper 函数存在，这样代码会非常冗余

**使用插件后的情况**

```js
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
```

这样，可以做到重复利用 helper 函数，减少大量的重复代码

## 六月

### Babel 开启ES7装饰者模式

安装插件

```
yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

增加 `plugins` 配置：

```js
module.exports = {
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }]
  ]
}
```

### new 构造函数背后发生了什么

- 以构造器的 `prototype` 属性为原型，创建新对象
- 将新对象为 `this`，调用参数传给构造器，执行
- 如果构造器返回的是对象，则返回，否则返回第一步创建的对象

如何实现一个`new`函数呢？

```js
function _new(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const res = fn.apply(obj, args)
  return res instanceof Object ? res : obj
}
```

### transitionend 事件细节

> 当 transition 完成前移除 transition 时，比如移除 css 的 `transition-property` 属性，事件将不会被触发，还有在 transition 完成前设置 `display: none`，事件同样不会被触发

### css 加载会造成阻塞吗？

看到一篇不错的文章，请戳 [css加载会造成阻塞吗](https://zhuanlan.zhihu.com/p/43282197)

结论：

- css加载不会阻塞DOM树的解析
- css加载会阻塞DOM树的渲染
- css加载会阻塞后面js语句的执行


### 在 webpack 中 process.env.NODE_ENV 是如何生效的

最近在做项目时，经常会用 `process.env.NODE_ENV` 来区分生产环境和开发环境，分别进行不同的逻辑编写，虽然用起来很方便，但是不知道背后是怎么实现。抱着这份好奇心，便研究了一下。

在 `node.js` 环境中，`process.env` 包含当前的环境变量，但是在 `webpack` 打包出来的代码是浏览器运行时的，跟 `node.js` 那种无关。所以在 `webpack` 环境下，是用了一个名为 `DefinePlugin` 的插件来实现 `process.env` 这些功能的

关于这个插件，可以看看这里 [https://webpack.js.org/plugins/define-plugin/#usage](https://webpack.js.org/plugins/define-plugin/#usage)

我当前做的项目是`vuecli3`构建出来的，看了下`webpack`配置信息，脚手架很贴心帮我们配置好了，类型这种:

```js
new DefinePlugin(
  {
    'process.env': {
      NODE_ENV: '"development"',
      BASE_URL: '""'
    }
  }
),
```

所以，我们在代码中可以这么写

```js
const isDev = () => process.env.NODE_ENV === "development";
```

但是，问题又来了，比如，我在点击事件中

```js
handleClick() {
  console.log(process.env);
}
```

点击后，控制台打印出了上面定义的对象

```js
{
  NODE_ENV: 'development',
  BASE_URL: ''
}
```

开始我以为 `process` 这变量是挂在 `window` 上了，后来验证了下并不是，但是 `process.env` 是怎么打印出来的呢？

后来，我去查了下打包后的代码，发现原来是这么实现的

```js
handleClick() {
  console.log(Object({"NODE_ENV":"development","BASE_URL": ""}));
}
```

`DefinePlugin` 插件可以在 `webpack` 编译时就把定义好的变量直接转译了，真相终于被揭晓了。 

### 关于 npm 包版本号前缀 ~ 和 ^ 区别

~ 会匹配安装最近的小版本依赖包，比如~1.2.3会匹配所有1.2.x版本，但是不包括1.3.0

^ 会匹配安装最新的大版本依赖包，比如^1.2.3会匹配所有1.x.x的包，包括1.3.0，但是不包括2.0.0

## 七月

### [Falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) 和 [Truthy](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy)

> **Falsy**(虚值) 是在 Boolean 上下文(条件语句或者循环语句中)中已认定可转换为 **假** 的值

下面的都是 `Falsy`：

- `undefined`
- `null`
- `NaN`
- `0`
- `''`
- `false`
- `document.all`

> **Truthy**(真值) 是指的是在布尔值上下文中，转换后的值为真的值，除了上面 **Falsy** 以外的值都是真值

### 事件传播的三个阶段是什么？

Capturing > Target > Bubbling

捕获 > 目标 > 冒泡

### flex 项目属性值记录

- order: <integer> 默认为 0 (定义项目的排列顺序)
- flex-grow: <number> 默认为 0 (如果存在剩余空间，也不伸展放大)
- flex-shrink: <number> 默认为 1 (如果空间不足，该项目将被挤压缩小)
- flex-basis: <length> | auto; (定义了在分配多余空间之前，项目占据的主轴空间，auto 为项目的本来大小)
- flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

### 关于 观察者模式和发布订阅模式

```js
// 观察者模式
// 一种一对多的依赖，当一个对象的状态发生改变时，所以依赖它的对象都将得到通知

// demo
class Observer {
  constructor() {
    this.subs = []
  }

  subscribe(target, cb) {
    target.subs.push(cb)
  }

  publish() {
    this.subs.forEach(sub => sub())
  }
}

const ob1 = new Observer();
const ob2 = new Observer();
const ob3 = new Observer();

ob2.subscribe(ob1, function() {
  console.log('ob2 添加了对 ob1 的依赖，ob1 通知了我会响应')
})

ob3.subscribe(ob1, function() {
  console.log('ob3 添加了对 ob1 的依赖，ob1 通知了我会响应')
})

ob1.publish() // ob1 发通知了

// 发布-订阅 
// 发布-订阅 是观察者的升级版
// 发布-订阅 拥有一个调度中心
// 如果用 发布-订阅 ，上面 Observer 类的 subscribe 和 publish 方法都在 observer 对象(调度中心) 进行管理

const observer = {
  subs: Object.create(null),
  subscribe(type, cb) {
    (this.subs[type] || (this.subs[type] = [])).push(cb)
  },
  publish(type, ...args) {
    (this.subs[type] || []).forEach(cb => cb.apply(null, args))
  }
}

observer.subscribe('ob', function() {
  console.log('ob 事件被订阅了，可以发布')
})

observer.subscribe('obob', function() {
  console.log('obob 事件被订阅了，可以发布')
})

observer.publish('ob')
observer.publish('obob')
```

### js 词法分析

js 运行前会进行词法分析，主要为三个步骤：

- 分析参数

- 分析变量的声明

- 分析函数的声明

尝试分析下面代码：

```js

function t1(age) {

  console.log(age); // function age(){}

  var age = 27;

  console.log(age); // 27

  function age() {}

  console.log(age); // 27

}

t1(3);

```

具体步骤：

函数在运行的瞬间，生成一个活动对象（Active Object），简称 AO

第一步：分析参数：

函数接收形式参数，添加到 AO 的属性，并且这个时候 age 值为 undefined，即 AO.age=undefined

接收实参，添加到 AO 的属性，覆盖之前的 undefined, AO.age = 3

第二步：分析变量声明：如 var name;或 var name='mary'，以上代码存在 var age = 27

这时候 AO 上面已经有 age 属性了，则不作任何修改，否则，否则 AO 的属性值为 undefined

第三步：分析函数的声明：

function age(){}把函数赋给 AO.age ,覆盖上一步分析的值

AO.age = function age(){}

### 关于 axios 无法请求 koa 写的接口的问题

我在前端页面试着用`axios`请求用`koa`写的接口，这是前端代码：

```js
async function axiosPost() {
  const data = {
    name: 'shooter'
  }
  await axios.post('http://localhost:3000/json', data)
}
```

这是后端接口：

```js
router.post('/json', async (ctx, next) => {
  ctx.body = {
    status: '200',
    data: {}
  }
  await next()
})
```

发现这时候请求报了个跨域的错误，于是，我在上面加了跨域处理

```js
router.all("/*", async (ctx, next) => {
  // *代表允许来自所有域名请求，包括 OPTION 请求
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
});
```

发现还是报了`has been blocked by CORS policy: Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.`这个错误。仔细看下，其实是请求头`content-type`被修改了，主要原因是`axios`post请求的`content-type`默认用`application/json`，相当于`xhr.setRequestHeader('Content-type', 'application/json;');`，所以解决方案是允许修改请求头，还要加多一行代码：

```js
router.all("/*", async (ctx, next) => {
  // *代表允许来自所有域名请求，包括 OPTION 请求
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "*");
  await next();
});
```

这样就可以了

为再验证下，手写了个原生`post`请求：

```js
function postJson() {
  const xhr = new XMLHttpRequest()
  const data = {
    name: 'shooter'
  }
  xhr.open('post', 'http://localhost:3000/json')
  // 不设这个，上面不设 ctx.set("Access-Control-Allow-Headers", "*");不报错
  // 设了这个，上面就要设 Access-Control-Allow-Headers"
  xhr.setRequestHeader('Content-type', 'application/json;')
  xhr.send(JSON.stringify(data))

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr)
    }
  }
}
```

用中间件 [koa2-cors](https://github.com/zadzbw/koa2-cors) 也可以解决这类问题

### jenkins 常用的环境变量

```
项目名称：PROJECT_NAME

构建编号：BUILD_NUMBER

构建状态：BUILD_STATUS

触发原因：CAUSE

构建地址：BUILD_URL
```

### window.performance 计算首屏时间

- 首屏时间 = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.domLoading
- 白屏时间 = window.performance.timing.domLoading - window.performance.timing.fetchStart

### 打印 dom 对象具体信息

```js
const div = document.createElement('div')
console.log([div]) // 用数组包一层
```

## 八月

### 如何前后端配合自定义请求响应头字段

前端如果要获取`response header`里面的值，可以通过`XMLHttpRequest`实例的`getResponseHeader()`方法进行获取，但是根据[w3c-cors标准](https://www.w3.org/TR/2014/REC-cors-20140116/)，参考**7.1.1**，可以看出不是所有的请求头字段都可以获取到，只有`simple-response-header`和设置了`Access-Control-Expose-Headers`指定字段才可以被`getResponseHeader()`获取到，关于`simple-response-header`有以下这几种：

- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma

这几种都可以获取到。

但是，如果我想自定义一个字段，就需要和后端配合`Access-Control-Expose-Headers`来实现

比如在`koa`中，设置对应的字段即可：

```js
router.get('/get', async (ctx, next) => {
  ctx.set('Access-Control-Expose-Headers', 'token')
  ctx.set('token', '123456')
  ctx.body = 'success'
  await next()
});
```

使用`axios`请求就能在返回的对象`headers`字段中获取：

```js
axios.get('/get').then(res => {
  console.log(res.headers.token); // '123456'
})
```

### img在外层div使用 line- height 居中无效？

解决方案1：

`img`元素使用 `vertical-align: middle`

```html
<div>
  <img src="xxx"/>
</div>
```

```css
div {
  line-height: 300px;
}
div img {
  vertical-align: middle;
}
```

解决方案2：

不用`line-height`居中，直接用`flex + margin`

```css
div {
  height: 300px;
  display: flex;
}
div img {
  margin: auto 0;
}
```

### scss @extend

scss 提供的`@extend`函数非常方便，甚至伪类都可以被继承:

```scss
.item {
  &:hover {
    // ...
  }
  &.active {
    @extend :hover; // 这样 .item.active 便可继承 .item:hover 的样式了
  }
}
```

### 桥接 vue 组件api的方式

使用 `v-bind` 属性和 `v-on` 事件即可实现：

```vue
<template>
  <AppList v-bind="$props" v-on="$listeners"> <!-- ... --> </AppList>
</template>

<script>
  import AppList from "./AppList";

  export default {
    name: 'SortableList',
    props: AppList.props,
    components: {
      AppList
    }
  };
</script>
```

这样`SortableList`组件的属性和事件就和`AppList`组件一致了

### 获取最外层节点的 offsetLeft

```js
function getElementLeft(element) {
　let actualLeft = element.offsetLeft;
　let current = element.offsetParent;

　while (current !== null){
　　actualLeft += current.offsetLeft;
　　current = current.offsetParent;
　}

　return actualLeft;
}
```

### css 多行文本溢出效果

- 单行：

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

- 多行：

仅兼容webkit内核的浏览器

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; // 行数
overflow: hidden;
```

- 兼容：

```css
p{position: relative; line-height: 20px; max-height: 40px;overflow: hidden;}
p::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);
}
```

### http 状态码

状态代码有三位数字组成，第一个数字定义了响应的类别，共分五种类别:

- 1xx：指示信息--表示请求已接收，继续处理
- 2xx：成功--表示请求已被成功接收、理解、接受
- 3xx：重定向--要完成请求必须进行更进一步的操作
- 4xx：客户端错误--请求有语法错误或请求无法实现
- 5xx：服务器端错误--服务器未能实现合法的请求

## 九月

### Vue.extend

根据文档解释：

> 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

其实就是返回一个`VueComponent`函数，和调用`Vue.component`(选项不为`null`前提)返回的一样：

```js
var Sub = function VueComponent (options) {
  this._init(options);
};
return Sub;
```

使用的话，可以这样：

```js
const Ctor = Vue.extend({
  data() {
    return {}
  },
  template: `<div>comp</div>`
}) 

// 这里还是可以传入组件选项的对象
// 实例化一个组件
const comp = new Ctor({
  data: {}
})

// 使用
comp.$mount();
document.body.appendChild(comp.$el);
```

### :empty 伪类

`:empty`选择器选择每个没有任何子级的元素，包括文本节点

```html
<div></div>
```

```css
div:empty {
  height: 100px;
  width: 100px;
}
```

### 判断浏览器事件侦听器是否兼容`passive`

```js
var supportsPassive = false;

try {
  // 通过 getter 判断
  var opts = Object.defineProperty({}, 'passive', { get: function(){ supportsPassive = true }});
  // 绑定一个事件，触发上面的 getter，如果异常，说明浏览器不支持
  document.addEventListener('test', function() {}, opts);
} catch (error) {}

elem.addEventListener('touchstart', fn, supportsPassive ? { passive: true } : false);
```

### 逗号操作符

逗号操作符用得很少，偏冷门，但是面试可能会被问到，所以在此记录下

> 逗号操作符，对它的每个操作数求值（从左到右），并返回最后一个操作数的值

```js
var x = 1;

x = (x++, x); // x > 2

var arr = [1,2,3,4]

arr[4,1,3,2] // arr[2] > 3

```

### 判断浏览器是否已滚动到底部

```js
window.addEventListener('scroll', function() {
  const { scrollTop, scrollHeight, clientHeight } = document.scrollingElement;

  // 滚动高度 + 视口高度 >= 文档总高度
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('到达底部了~')
  }
})
```

### 为什么vue组件选项中的data必须是个函数？

注册组件的本质实际上是建立一个组件构造器的引用，在使用时才会去实例化。也就是生成一个function。

下面就关于原型的知识了

​组件data属性实际上在挂载到 构造器function.prototype上的，比如

```js
const Comp = function () {}

Comp.prototype.data = ...
```

​如果该原型下的data属性值为**对象**

```js
// 创建构造器Comp
Vue.component('Comp', {
  data: {
    a: 1,
    b: 2
  }
})

const Comp = function ({ data }) {
  // 类似于这种
  this.data = this.data;
}

// 简化后的代码实际上是这个
// 取到注册对象 data 属性并挂载到构造器原型上
Comp.prototype.data = {
  a: 1,
  b: 2
}

// 如果多次实例化
const compA = new Comp();
const compB = new Comp();

compA.data === compB.data; // true 两者共同指向同一地址
compA.data.c = 3;
console.log(compB.data.c); // 3 (这样就容易引起麻烦)

```

为了避免引发上述的麻烦，通过函数独立作用域便可解决

```js
// 创建构造器Comp
Vue.component('Comp', {
  data() {
    // 每次调用都返回一个新的对象
    return {
      a: 1,
    	b: 2
    }
  }
})

const Comp = function ({ data }) {
  // 调用原型 data 函数，每个组件实例都有各自的数据副本，避免数据互相影响
  this.data = this.data();
}

Comp.prototype.data = function () {
  a: 1,
  b: 2
}

const compA = new Comp();
const compB = new Comp();

compA.data === compB.data; // false

```

## 十月

### tree 组件半选框的核心逻辑

```js
function indeterminate(item) {
  // 递归获取该节点下的所有子节点
  const leafNodes = this.getLeafNodes(item);
  return {
    // indet 为半选控制
    // 当子节点非全部选中时和至少有一个子节点被选中，才会出现半选
    indet:
      !leafNodes.every(n => n.selected) && leafNodes.some(n => n.selected),
      value: leafNodes.every(n => n.selected)
  };
}
```

### Vue.nextTick 渲染时机

先来看一段代码：

```js
const app = new Vue({
  data: {
    a: 1
  }
})

// setTimeout 模拟请求，都是task
setTimeout(() => {
  app.a = 2 // 这里也是执行 nextTick

  console.log(app.$el.innerHTML) // 1
  Vue.nextTick(() => {
    console.log(app.$el.innerHTML) // 2
    alert('卡住线程，阻塞渲染') // 可以看到视图上还是 1
  })
},0)
```

`nextTick`本质是**microtask**，浏览器渲染时序是

> 执行当前 macrotask -> 清空 microtask -> render layout

这也是**eventloop**的基本特征

vue文档上说，只有在nextTick回调中才能拿到更新后的值，为什么这么做？实际上是用于优化减少dom的操作

你会发现，上述代码中，根据注释，在同个事件循环中(上面两个`nextTick`隶属于同个事件循环)，为什么在后面那个`nextTick`中能拿到最新的值呢，毕竟视图并没有更新。

> js获取视图新的节点值不一定要等到UI更新后才能拿到

通过添加`alert`阻塞视图渲染，印证了这个原理，在视图没更新的情况下，我们也能拿到dom节点的最新值。

### js 什么时候一定要写分号

在 JavaScript 中，分号通常是可选的，因为会自动插入分号（ASI)。你可以使用 semi 规则要求或禁止分号。

ASI 的规则是相对简单的：正如 Isaac Schlueter 曾经描述的那样，一个 \n 字符总是一个语句的结尾(像分号一样)，除非下面之一为真：

- 该语句有一个没有闭合的括号，数组字面量或对象字面量或其他某种方式，不是有效结束一个语句的方式。（比如，以 . 或 , 结尾）
- 该行是 -- 或 ++（在这种情况下它将减量/增量的下一个标记）
- 它是个 for()、while()、do、if() 或 else，并且没有 {
- 下一行以 [、(、+、*、/、-、,、. 或一些其它在单个表达式中两个标记之间的二元操作符。

换行不结束语句，书写错误遗漏了分号，这些异常会导致两个不相干的连续的行被解释为一个表达式

```js
const b = [1,2,3]
const a = b
[1,2,3].forEach(...)
```

这段代码实际上是

```js
const a = b[1,2,3].forEach(...)
```

所以必须写成

```js
const b = [1,2,3]
const a = b;
[1,2,3].forEach(...)
```

这样才不会运行错误!

还有，函数立即执行

```js
const a = 123
(function () {  })()
```

有没有看出问题？这段代码是会运行报错的！因为这满足了上面文字中的第4条！

实际上还是这样执行

```js
const a = 123(function () {  })()
```

所以要这么写

```js
const a = 123;
(function () {  })()
```

或者

```js
const a = 123
;(function () {  })()
```

如果你本人是拒绝分号党，那么强烈建议你用`eslint`帮你预警！不然还是回归到分号党吧！

### 如何劫持ajax请求？

本质是劫持`XMLHttpRequest`实例的`send`请求，所以我们可以重写这个方法进行劫持：

```js
class XML extends XMLHttpRequest {
  constructor() {
    super()
  }

  send(...args) {
    console.log('hhh，被我发现了吧');
    super.send(...args); // 调用父类方法可以发送请求
  }
}

XMLHttpRequest = XML

axios.get('xxx') // 可以看到上面的 console.log()
```

### 如何判断该函数是不是原生函数

```js
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
```

## 十一月

### text-overflow: ellipsis 不生效的原因？

必须是块级元素，`display: flex` 影响生效的原因之一，

根据`MDN文档`，

> 这个属性只对那些在块级元素溢出的内容有效，但是必须要与块级元素内联(inline)方向一致（举个反例：内容在盒子的下方溢出。此时就不会生效）。文本可能在以下情况下溢出：当其因为某种原因而无法换行(例子：设置了"white-space:nowrap")，或者一个单词因为太长而不能合理地被安置(fit)。

参考[这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-overflow)

### 把数组某个值快速置后的方法

```js
const arr = [1,2,3];
const fn = (arr, index) => arr.push(arr.splice(index, 1)[0]);

fn(arr, 1); // arr => [1,3,2];
```

<ToTop/>
