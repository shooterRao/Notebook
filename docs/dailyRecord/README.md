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
视口滚动的距离 / 文档总高度 - 视口高度
:::

```js
// jq
($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;

// js
(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
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

### transitionend 事件细节

> 当 transition 完成前移除 transition 时，比如移除 css 的 `transition-property` 属性，事件将不会被触发，还有在 transition 完成前设置 `display: none`，事件同样不会被触发

### css 加载会造成阻塞吗？

看到一篇不错的文章，请戳 [css加载会造成阻塞吗](https://zhuanlan.zhihu.com/p/43282197)

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

<ToTop/>
