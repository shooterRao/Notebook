# 面试复习

## js

### 类型

基本类型：

Undefined

Null

String

Number

Boolean

Symbol



引用类型：

Object



类型转换：

![image-20201113105711953](./img/image-20201113105711953.png)

![类型转换](https://static001.geekbang.org/resource/image/71/20/71bafbd2404dc3ffa5ccf5d0ba077720.jpg)


Q1: 判断是不是字符串数字？

```js
function testStringNum(str) {
  return !Number.isNaN(+str)
}
```



### 原型

#### js 原型和原型链的理解

js 原型是指为其它对象提供共享属性访问的对象。在创建对象时，每个对象都包含一个隐式引用(`__proto__`)指向它的原型对象或者null(`Object.prototype`)

原型链：原型也是对象，因此它也有自己的原型。这样就构成了一个原型链。

#### 原型链有什么作用？

在访问一个对象的属性时，实际上是在查询原型链。这个对象是原型链的第一个元素，先检查它是否包含属性名，如果包含则返回属性值，否则检查原型链上的第二个元素，以此类推。

#### 如何实现原型继承？

有两种方式。一种是通过 Object.create 或者 Object.setPrototypeOf 显式继承另一个对象，将它设置为原型。

另一种是通过 constructor 构造函数，在使用 new 关键字实例化时，会自动继承 constructor 的 prototype 对象，作为实例的原型。

在 ES2015 中提供了 class 的风格，背后跟 constructor 工作方式一样，写起来更内聚一些。

#### **你能说一个原型里比较少人知道的特性吗？**

在 ES3 时代，只有访问属性的 get 操作能触发对原型链的查找。在 ES5 时代，新增了 accessor property 访问器属性的概念。它可以定义属性的 getter/setter 操作。

具有访问器属性 setter 操作的对象，作为另一个对象的原型的时候，设置属性的 set 操作，也能触发对原型链的查找。

普通对象的 __proto__ 属性，其实就是在原型链查找出来的(`get __proto__`)，它定义在 Object.prototype 对象上。

### 闭包

闭包是指有权访问另一个函数作用域中的变量的函数。	

闭包是基于词法作用域书写代码时所产生的自然结果。当函数记住并访问所在的词法作用域(词法环境[[Environment]])，闭包就产生了。

Q：为什么说JavaScript中函数都是天生闭包的？

A：JavaScript 中的函数会自动通过隐藏的 `[[Environment]]` 属性记住创建它们的位置，所以它们都可以访问外部变量，能访问外部变量就产生了闭包。

![image-20201014162314708](./img/image-20201014162314708.png)

注意：

如果我们使用 `new Function` 创建一个函数，那么该函数的 `[[Environment]]` 并不指向当前的词法环境，而是指向全局环境。

因此，此类函数无法访问外部（outer）变量，只能访问全局变量。

缓存一些变量，可以用闭包，不一定非要用类的方式去缓存



### 作用域链

函数的作用域在函数定义的时候就决定了。

作用域链，是函数执行上下文中的一部分。当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。



### this

函数的执行上下文联系在一起，普通函数执行指向调用函数的对象

new调用构造函数，指向实例化的对象

箭头函数没有this，它只会从自己的作用域链的上一层继承this

bind，call，apply指向指定的this



### 执行上下文

执行函数前的准备工作，也就是函数的执行环境

在 ES5 中，我们改进了命名方式，把执行上下文最初的三个部分改为下面这个样子。

- lexical environment：词法环境，当获取变量时使用，也叫作用域链
- variable environment：变量环境，当声明变量时使用，变量对象
- this value：this 值。

在 ES2018 中，执行上下文又变成了这个样子，this 值被归入 lexical environment，但是增加了不少内容。

- lexical environment：词法环境，当获取变量或者 this 值时使用。
- variable environment：变量环境，当声明变量时使用。
- code evaluation state：用于恢复代码执行位置。
- Function：执行的任务是函数时使用，表示正在被执行的函数。
- ScriptOrModule：执行的任务是脚本或者模块时使用，表示正在被执行的代码。
- Realm：使用的基础库和内置对象实例。
- Generator：仅生成器上下文有这个属性，表示当前生成器。

词法环境

![image-20201014153010065](./img/image-20201014153010065.png)



### new

当一个函数被使用 `new` 操作符执行时，它按照以下步骤：

1. 生成一个新对象
2. 链接到原型
3. 绑定this，函数体执行
4. 如果函数返回的是对象，返回这个对象，否则返回自己生成的对象

Q：如何保证函数必须要用new调用

A：

```js
function User() {
  if (!new.target) { // 如果你没有通过 new 运行我
    throw new TypeError("Cannot call a class as a function");
  }
  ...
}
  
// 或者用这种方法
function User() {
  if (!(this instanceof User)) {
    throw new TypeError("Cannot call a class as a function");
  }
  ...
}
```



Q：如何实现一个`new`函数呢？

A：

```js
function _new(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const res = Constructor.apply(obj, args);
  return res instanceof Object ? res : obj;
}
```



### 深浅拷贝

#### 深拷贝

```js
function deepClone(obj) {
    // 非 object 或者为 null，直接返回
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }
    
    let copy = {}
    
    if (Array.isArray(obj)) {
      copy = []
    }
    
    
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 递归
        copy[key] = deepClone(obj[key])
      }
    }
    
    return copy
    
  }
```

#### 浅拷贝

```js
var __assign = Object.assign || function(t) {
	for (var i = 1, n = arguments.length; i < n; i++) {
		var s = arguments[i];
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p)) {
        t[p] = s[p];
       }
     }
  }
  return t;
};
```



### 节流

把多个事件控制在ms执行分片执行，用加锁的方法来控制节流

比如300ms执行一次，那在1000ms内，如果你触发了10次事件，但也只会执行3次

```js
function throttle(fn, ms = 300) {
  let canRun = true;
  return function() {
    if (!canRun) {
      return;
    }
    canRun = false;
    setTimeout((...args) => {
      fn.apply(this, args);
      canRun = true;
    }, ms);
  }
}
```



### 防抖

连续事件触发结束后只触发一次，用去除定时器的方法

```js
function debounce(fn, ms) {
  let timeout = null;
  return function(...args) {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    },ms);
  }
}
```



### 继承

#### 原型继承

JavaScript通过`[[Prototype]]`实现原型继承，也就是`__proto__`

通过 Object.create 或者 Object.setPrototypeOf 显式继承另一个对象，将它设置为原型

```js
const superObj = {a: 1};
const subObj = Object.create(superObj);
subObj.__proto__ === superObj;// true;
```

或者通过 constructor 构造函数，在使用 new 关键字实例化时，会自动继承 constructor 的 prototype 对象，作为实例的原型

#### 类继承

class extends 方式继承，本质上也是基于原型

实现方式

步骤：

1、原型继承

`subClass.prototype.__proto__ === superClass.prototype `

subClass.prototype = Object.create(superClass.prototype); 

`subClass.__proto__ === superClass`

Object.setPrototypeOf(subClass, superClass);

 2、调用父类构造函数

_this = _possibleConstructorReturn(this, Super.call(this, name));

实现 A extends B

es6

```js
class A {
  constructor(opt) {
    this.name = opt.name;
  }
}
class B extends A {
  constructor() {
    // 向父类传参
    super({ name: 'B' });
    // this 必须在 super() 下面使用
    console.log(this);
  }
}
```

es5

```js
function _extends(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
  Object.setPrototypeOf(child, parent);
}

function _checkConstructorReturn(self, call) {
  if (call && (typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  if (self !== undefined) {
    return self;
  }
}

var A = (function() {
  return function A(opt) {
    this.name = opt.name
  }
})();

var B = (function(_super) {
  _extends(A, _super);
  
  function B(opt) {
    let _this;
    _this = _checkConstructorReturn(this, _super.call(this, opt));
    return _this;
  }
  
  return B;
})(A)
```



### 事件循环

浏览器中 JavaScript 的执行流程和 Node.js 中的流程都是基于 **事件循环** 的。

它是一个在 JavaScript 引擎等待任务，执行任务和进入休眠状态等待更多任务这几个状态之间转换的无限循环。

引擎的一般算法：

1. 当有任务时，从最先进入的任务开始执行。
2. 休眠直到出现任务，然后转到第 1 步。

设置任务 —— 引擎处理它们 —— 然后等待更多任务（即休眠，几乎不消耗 CPU 资源）

注意：

- 引擎执行任务时永远不会进行渲染（render）。如果任务执行需要很长一段时间也没关系。仅在任务完成后才会绘制对 DOM 的更改。
- 如果一项任务执行花费的时间过长，浏览器将无法执行其他任务，无法处理用户事件，因此，在一定时间后浏览器会在整个页面抛出一个如“页面未响应”之类的警报，建议你终止这个任务。

所以，一般是一个任务结束后，清空微任务队列，然后就进行页面渲染，因为js线程和渲染ui线程互斥，当js线程运行的时候，ui线程处于冻结状态。

#### 任务

**任务** 就是由执行诸如从头执行一段程序、执行一个事件回调或一个 interval/timeout 被触发之类的标准机制而被调度的任意 JavaScript 代码。这些都在 **任务队列（task queue）**上被调度。

任务也称为宏任务，一般下面几种都是宏任务

- script 脚本
- click、mousemove等交互事件
- ajax
- setTimeout
- ...

多个任务组成了一个队列，即所谓的“宏任务队列”，即为**macroTask queue**

#### 微任务

每当一个任务存在，事件循环都会检查该任务是否正把控制权交给其他 JavaScript 代码。如若不然，事件循环就会运行微任务队列中的所有微任务。

在任务队列中的一个任务执行完后，就会清空当前微任务队列所有的微任务。

微任务为以下这种

- Promise
- queueMicrotask
- ...



## 网络

### 缓存策略

缓存是优化系统性能的重要手段，HTTP 传输的每一个环节中都可以有缓存；

服务器使用“Cache-Control”设置缓存策略，常用的是“max-age”，表示资源的有效期；

浏览器收到数据就会存入缓存，如果没过期就可以直接使用，过期就要去服务器验证是否仍然可用；

验证资源是否失效需要使用“条件请求”，常用的是“if-Modified-Since”和“If-None-Match”，收到 304 就可以复用缓存里的资源；

验证资源是否被修改的条件有两个：“Last-modified”和“ETag”，需要服务器预先在响应报文里设置，搭配条件请求使用；浏览器也可以发送“Cache-Control”字段，使用“max-age=0”或“no_cache”刷新数据。

HTTP 缓存看上去很复杂，但基本原理说白了就是一句话：“没有消息就是好消息”，“没有请求的请求，才是最快的请求。”



#### 有了【`Last-Modified，If-Modified-Since`】为何还要有【`ETag、If-None-Match`】

![image-20201105112212024](./img/image-20201105112212024.png)



#### 强缓存和协商缓存

强缓存：Cache-Control、Expires

协商缓存：Last-Modified/If-Modified-Since、ETag/If-None-Match

#### 其它问题

QA：遇到的缓存问题

1.from disk cache 和 from memory cache 区别

都使用了强缓存

内存缓存(from memory cache)和硬盘缓存(from disk cache)

在浏览器中，浏览器会在js和图片等文件解析执行后直接存入内存缓存中，那么当刷新页面时只需直接从内存缓存中读取(from memory cache)；而css文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)

2.只设置Etag，那么为什么在 Chrome 下会有非验证性缓存呢？

没有设置 Cache-Control 这个头，其默认值是 Private ，在标准中明确说了：

> Unless specifically constrained by a cache-control
> directive, a caching system MAY always store a successful response

如果没有 Cache-Control 进行限制，缓存系统**可以**对一个成功的响应进行存储

很显然， Chrome 是遵守标准的，它在没有检查到 Cache-Control 的时候对响应做了非验证性缓存，所以你看到了 200 from memory cache
同时 Safari 也是遵守标准的，因为标准只说了**可以**进行存储，而非**应当**或者**必须**，所以 Safari 不进行缓存也是合理的

我们可以理解为，没有 Cache-Control 的情况下，缓存不缓存就看浏览器高兴，你也没什么好说的。那么你如今的需求是“明确不要非验证性缓存”，则从标准的角度来说，你**必须**指定相应的 Cache-Control 头

3.常见Cache-Control 的 max-age 有效值设置

365天

```
Cache-Control：max-age = 315360000
```

30天

```
Cache-Control：max-age = 25920000
```

4.Response Header 中 Age 与 Date

Age表示命中代理服务器的缓存. 它指的是代理服务器对于请求资源的已缓存时间, 单位为秒.

Date指的是响应生成的时间，请求经过代理服务器时, 返回的Date未必是最新的, 通常这个时候, 代理服务器将增加一个Age字段告知该资源已缓存了多久。



###  POST和GET的区别

- GET在浏览器回退时时无害的，而POST会再次提交请求
- GET产生URL地址可以被收藏，而POST不可以
- GET请求会被浏览器主动缓存，而POST不会，除非手动设置
- GET只能进行url编码，而POST支持多种编码方式
- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留
- GET请求在URL中传送的参数是有长度限制的，而POST没有限制
- 对参数的数据类型，GET只接受ASCII字符，而POST没有限制
- GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息
- GET参数通过URL传递，POST放在Request Body中



### TCP

TCP，传输控制协议，是一种面向连接的、可靠的、基于字节流的传输层协议。

#### 三次握手

![image-20201112201240766](./img/image-20201112201240766.png)

第一次握手：客户端发送一个SYN码（当SYN=1，ACK=0时，表示当前报文段是一个连接请求报文。当SYN=1，ACK=1时，表示当前报文段是一个同意建立连接的应答报文），要求建立数据连接

第二次握手：服务器如果同意连接，向客户端发送SYN+ACK的应答码

第三次握手：客户端再次发送ACK向服务器，服务器验证ACK没有问题，则建立连接



#### 四次挥手

第一次挥手：客户端发送FIN报文给服务端，通知服务器数据已经传输完毕

第二次挥手：服务器接收到之后，发送ACK给客户端，数据还没传输完成

第三次挥手：服务器已经传输完毕，再次发送FIN+ACK通知客户端，数据已经传输完毕

第四次挥手：客户端再次发送ACK，进入TIME_WAIT状态，服务端关闭，客户端等待2MSL后关闭

为什么客户端要等到2MSL后再关闭？

等待2MSL时间主要目的是怕最后一个ACK包对方没收到，那么对方在超时后将重发第三次握手的FIN包，主动关闭端接到重发的FIN包后可以再发一个ACK应答包。



### UDP

UDP 协议是面向无连接的，也就是说不需要在正式传递数据之前先连接起双方。



### 



### 状态码。`302.304.301.401.403`的区别？

- 200 OK：客户端请求成功
- 206 Partial Content：客户发送了带有Range头的GET请求，服务端完成了它(场景用于大视频的请求)
- 301 Moved Permanently：所请求的页面已经永久转移致新的url **永久重定向**
- 302 Found：所请求的页面已经临时转移至新的url **临时重定向**
- 304 Not Modified：客户端有缓冲的文档并发出了一个条件性的请求，服务端告诉客户，原来缓存的文档还可以继续使用
- 400 Bad Request：客户端请求有语法错误，不能被服务端所解析
- 401 Unauthriozed：请求未经授权，这个状态码必须和WWW-Authenticate报头一起用
- 403 Forbidden：对被请求页面的访问已被禁止
- 404 Not Found：请求资源不存在
- 500 Internal Server Error：服务器发生不可预期的错误，原来缓冲的文档还可以继续使用
- 503 Server Unavailable：请求未完成，服务器临时过载或宕机，一段时间后可能恢复正常



### HTTP的持久连接

HTTP协议采用“请求-应答”模式，当使用普通模式，即非Keep-Alive模式时，每个请求/应答客户和服务器都要新建一个连接，完成后立即断开连接（HTTP协议为无连接协议）

当使用Keep-Alive模式（又称持久连接、连接重用）时，Keep-Alive功能使客户端到服务端的连接持续有效，当出现对服务器的后续请求时，Keep-Alive功能避免了建立或者重新建立连接

这个Keep-Alive持久连接技术要HTTP的1.1版本才支持，其1.0版本都不支持



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



### OPTIONS预请求

跨源资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 以外的 HTTP 请求，或者搭配某些 MIME 类型的 [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST) 请求），浏览器必须首先使用 [`OPTIONS`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS) 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。

1、使用了这些请求方法：PUT/DELETE/CONNECT/OPTIONS/TRACE/PATCH

2、人为设置了以下集合之外的请求头

- Accept

- Accept-Language
- Content-Language
- Content-Type
- DPR
- Downlink
- Save-Data
- Viewport-Width
- Width

3、Content-Type 不属于以下这几种

- application/x-www-form-urlencoded
- multipart/form-data
- text/plain



### HTTP1.0/1.1/2.0区别





### HTTPS





## 安全

### `XSS` 跨站脚本攻击

就是攻击者想办法将一段可以执行的代码注入到网页中

比如在输入框中，输入`<script>console.log('xxx')</script>`

如何防御？

对用户输入的内容进行转移字符，可以使用`js-xss`库

开启CSP，建立白名单，告诉浏览器哪些资源可以加载

### `CSRF` 跨站请求伪造

攻击者构造出一个后端请求地址，诱导用户点击或者通过某种手段发起请求

如果用户是在登录状态情况下，请求地址的后端误以为是用户在操作

如何防御？

1、get请求不对数据进行修改

2、不让第三方网站访问到用户cookie

3、阻止第三方网站请求接口

4、请求时附带验证信息



## css

### BFC

BFC：块级格式化上下文

- float属性不为none
- position为absolute或fixed
- display为inline-block, table-cell, table-caption, flex, inline-flex
- overflow不为visible。

用途

- 清除元素内部浮动
- 解决外边距合并(塌陷)问题
- 制作右侧自适应的盒子问题

### css盒模型

所有HTML元素可以看作盒子，在CSS中，"box model"这一术语是用来设计和布局时使用。

CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：边距，边框，填充，和实际内容。

盒模型允许我们在其它元素和周围元素边框之间的空间放置元素。

![image-20201110163721554](./img/image-20201110163721554.png)

盒模型又分2种

w3c盒模型 content-box

属性width、height只包含内容content，不包含border和padding

IE盒模型 border-box

属性width、height包含border和padding

## vue

### 为什么vue组件中的data必须是个函数？

答：注册组件的本质实际上是建立一个组件构造器的引用，在使用时才会去实例化。也就是生成一个function。

下面就关于原型的知识了

​		组件data属性实际上在挂载到 构造器function.prototype上的，比如

```js
const Comp = function () {}

Comp.prototype.data = ...
```

​		如果该原型下的data属性值为**对象**

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

​		

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



### vue为什么要使用异步更新队列

当状态发生改变的时候，vue采用异步执行dom更新

有篇文章写得很好，https://github.com/berwin/Blog/issues/22

主要是为了性能优化，减少无用的dom更新

Vue优先将渲染操作推迟到本轮事件循环的最后，如果执行环境不支持会降级到下一轮

当同一轮事件循环中反复修改状态时，并不会反复向队列中添加相同的渲染操作



### nextTick





### 模板编译过程





### Object.defineProperty 的缺陷





### v-if和v-show区别





### 渲染和更新过程





### diff算法











## react



## 前端框架通识

### Vue和React的区别

从vue的角度出发

更容易上手，可以script标签方式引入

template，也支持jsx

逻辑复用方式使用mixin，react现在不支持了

 function based API，react为usehooks

**Vue跟React的最大区别在于数据的reactivity，就是响应式系统上。**Vue提供响应式的数据，当数据改动时，界面就会自动更新，而React里面需要调用方法setState

Vue 进行数据拦截/代理，它对侦测数据的变化更敏感、更精确，组件更新粒度更细，React则并不知道什么时候“应该去刷新”，触发局部重新变化是由开发者手动调用 setState 完成，但是react是全部一起更新的。

为了达到更好的性能，React 暴漏给开发者 shouldComponentUpdate 这个生命周期 hook，来避免不需要的重新渲染（**相比之下，Vue 由于采用依赖追踪，默认就是优化状态：你动了多少数据，就触发多少更新，不多也不少，而 React 对数据变化毫无感知，它就提供 React.createElement 调用已生成 virtual dom**）

react

函数式，不可变数据，all in js

事件系统使用合成事件，都代理在document上

React 中事件处理函数中的 this 默认不指向组件实例



## Node

特点

- 异步IO
- 事件驱动
- 单线程
- 跨平台

单线程的缺点

- 无法利用多核cpu
- 错误会引起整个应用的退出
- 大量计算占用cpu会导致无法继续调用异步IO

可以做什么？

服务器、命令行工具、客户端

前端工程化



## 项目经验

### 优化方面

1、修复内存泄漏

eventBus 解绑事件、echarts实例dispose

2、首屏优化

- 路由页面全部采用懒加载

- 服务端开启gzip

- iview、echarts、loadsh按需加载

- json采用异步加载，不是直接import到bundle里

- 升级到vuecli3，vuecli3使用了webpack4，splitChunks 配合 preload-webpack-plugin 可以开启preload/prefetch 优化页面加载效率

  什么是 preload ? 和 prefetch 的区别

  Prefetch(预加载)可以强制浏览器在不阻塞 document 的 [onload](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload) 事件的情况下请求资源，告诉浏览器这个资源将来可能需要，但是什么时间加载这个资源是由浏览器来决定的。

  preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源，而 prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源，也就是，prefetch 是加速下一页的访问，而不是当前页面的访问。建议：对于当前页面很有必要的资源使用 preload，对于可能在将来的页面中使用的资源使用 prefetch，比如懒加载的资源适合用 prefetch，像 nodemodules 里面的库适合用 preload
  
- prerender-spa-plugin 使用预渲染插件

- 一些大的第三方包都采用异步加载的方式加载

3、iview tree 大数据量写render函数卡顿问题

如果不写自定义render函数，1000个子节点渲染、折叠动画过渡都不会有明显卡顿，但是如果节点过多，到了3000+就会卡，主要会在updateComponent函数里耗时很久，这块是vue要进行节点diff和patch操作

但是写了render函数，到了600个节点渲染就会开始卡顿

首先，iview的设计是这样子的，为了把节点数据传递给外部的render函数，用了计算属性，也就是node函数去把节点传递出去

如果写了render函数，在节点组件中使用了node计算属性，在vue进行节点组件render的时候，读取node计算属性时，会触发computedGetter函数，node函数是个computed watcher，而且node计算属性里面依赖了Tree.flatState，就是iview扁平化后的树结构，在读取这个Tree.flatState的时候，会调用flatState的reactiveGetter函数，再进行depend收集这个computed watcher，节点多的话，每个节点的computed watcher都要被flatState里的dep收集进去，这里就比较耗时了，因为dep不仅要收集node组件的render watcher，还得收集node的computed watcher

如果Tree.flatState数据量达到600，平均一个node函数需要3ms，如果渲染节点有600个，就是3ms * 600 = 1800ms，1.8s把主线程直接卡住了

渲染的每个节点，都会携带一个node的computed-watcher，而且都会被Tree.flatState的dep收集进去，但要折叠节点或者点击节点高亮的时候，iview会重新赋值Tree.flatState，把收集到的watcher全通知计算一遍，这样也会引起页面卡顿


![image-20201107140123267](./img/image-20201107140123267.png)

![image-20191022105330232](./img/image-20191022105330232.png)

![image-20191021235825708](./img/image-20191021235825708.png)

![image-20191021225946022](./img/image-20191021225946022.png)


如何解决？

1、简单粗暴，去掉node计算属性，缺点是render回调中没有返回扁平后的节点依赖，所以不能做类似编辑目录树这些组件，只能是纯渲染的目录树

2、另一种方法是，render节点改成函数式组件，减少实例化开销，并且采用 provide/inject 方法，把Tree实例传递下去，然后在render函数中拿到Tree.flatState

![image-20191022111059147](./img/image-20191022111059147.png)

这样外部就能拿到更多的数据了，跟iview原来用法一致

这种方案，在优化前的耗时是图1，优化后的耗时是图2:

![image-20191022110851695](./img/image-20191022110851695.png)

![image-20191022111723387](./img/image-20191022111723387.png)

渲染快了200多ms，但是总体还是偏慢，主要是触发了Tree.flatState去收集了节点组件render watcher的依赖，但是不用再去收集上面所说的node计算属性watcher了， 如果当前渲染节点少于600个节点，速度是没问题的，如果超过，每个节点在执行render函数时都会触发getter反复去收集依赖，即使收集依赖函数是0.6ms，0.6ms * 600 = 360ms，360ms在肉眼能感受到延迟，但是总体比1.8s快多了。

5、3000+节点目录树渲染

浙江省厅项目组那边遇到了个目录树加载的问题，就是在使用iview的tree组件，大数据量(1000+节点)情况下会非常卡顿，特别是折叠的时候，他们非常着急，所以求助了我。因为之前我优化过iview的tree组件卡顿问题，所以拿出我优化过的组件测试了下，虽然提速比较明显，但是依旧卡顿，掉帧明显。后来，我拿出了自己之前用ts写的树组件轮子(开源项目)，不依赖任何第三方库，很轻量，性能还不错，因为只会递归一次，加上用了事件代理，全局也只会绑定一个点击事件和一个双击事件，而iview在折叠的时候都会进行递归，每个节点都会有多个点击事件，所以会非常卡。经过测试，我的树组件轻松渲染3000+子节点数据，折叠也非常顺滑。这次经历，说明有空还是多练习写点轮子，说不定以后在某个关键时候就用得上了，解决燃眉之急。

6、长列表渲染

TODO



### 有哪些印象深刻的点

#### 系统升级方面

1、底层升级， axios 基于业务特点进行二次封装，layout 层抽象，读取路由表渲染，权限实现，项目结构的划分

2、提供外部配置文件提高实施部署效率，运行时读取json文件 -> 写入vuex -> 实例化 axios -> new Vue()

3、写了哪些全局组件？类似百度搜索(省市县)区域选择组件、二次封装modal、iframe组件、菜单组件...

4、require.context 自动注册全局组件，还有全局组件demo预览页面，文件夹即路由

5、iconfont不支持增量更新，所以采用svg替代，写了一个svg预览页面，方面开发去预览和读取，配合自研的svg-load插件

6、自动合并代码、打tag、打版本脚本

7、推广单元测试

8、使用hjson替代json，hjson支持内部写注释，让实施明白配置文件中字段的含义

9、合理利用缓存函数缓存请求的配置文件，避免没必要的重复请求



## 算法

### 树相关

#### 深度优先遍历

```js
const data = [
  {
    title: '1',
    children: [
      {
        title: '1-1',
        children: [
          {
            title: '1-1-1',
          },
          {
            title: '1-1-2',
          },
        ],
      },
      {
        title: '1-2',
        children: [
          {
            title: '1-2-1',
          },
        ],
      },
    ],
  },
  {
    title: '2',
    children: [
      {
        title: '2-1',
      },
    ],
  },
];

// 递归版本
function deepFirstSearch1(data) {
  const list = [];

  (function _search(data) {
    Array.isArray(data) &&
      data.forEach((node) => {
        list.push(node);
        const { children } = node;
        if (children && children.length !== 0) {
          _search(children);
        }
      });
  })(data);

  return list;
}
```



#### 广度优先遍历

```js
const data = [
  {
    title: '1',
    children: [
      {
        title: '1-1',
        children: [
          {
            title: '1-1-1',
          },
          {
            title: '1-1-2',
          },
        ],
      },
      {
        title: '1-2',
        children: [
          {
            title: '1-2-1',
          },
        ],
      },
    ],
  },
  {
    title: '2',
    children: [
      {
        title: '2-1',
      },
    ],
  },
];

// 广度优先是按一层层来遍历，每层搜索完再搜索下一层
function BreadthFirst(data) {
  const list = [];
  let queue = []; // 用队列解决，先进先出

  Array.isArray(data) &&
    data.forEach((node) => {
      queue.push(node);
    });

  while (queue.length) {
    const item = queue.shift();
    list.push(item);

    const { children } = item;

    if (children && children.length) {
      queue = [...queue, ...children];
    }
  }

  return list;
}
```



## webpack

### `import moduleName from 'xxModule'`和`import('xxModule')`经过`webpack`编译打包后最终变成了什么？在浏览器中是怎么运行的？

import经过webpack打包以后变成一些`Map`对象，`key`为模块路径，`value`为模块的可执行函数；

代码加载到浏览器以后从入口模块开始执行，其中执行的过程中，最重要的就是`webpack`定义的`__webpack_require__`函数，负责实际的模块加载并执行这些模块内容，返回执行结果，其实就是读取`Map`对象，然后执行相应的函数；

当然其中的异步方法（import('xxModule')）比较特殊一些，它会单独打成一个包，采用动态加载的方式，具体过程：当用户触发其加载的动作时，会动态的在`head`标签中创建一个`script`标签，然后发送一个`http`请求，加载模块，模块加载完成以后自动执行其中的代码，主要的工作有两个，更改缓存中模块的状态，另一个就是执行模块代码。



### base64是什么？

**「Base64」** 是一种基于 64 个可打印字符来表示二进制数据的表示方法，3字节等于4打印字符



### 项目优化

- 开发环境剔除第三方包，用cdn加载
- thread-loader多线程构建优化，通过SMP分析打包过程中loader和plugin的耗时
- 缩小打包作用域：尽可能使用alias、exclude/include确定loader规则范围





## 正则

正则表达式的() [] {}有不同的意思。

() 是为了提取匹配的字符串。表达式中有几个()就有几个相应的匹配字符串。

(\s*)表示连续空格的字符串。

[]是定义匹配的字符范围。比如 [a-zA-Z0-9] 表示相应位置的字符要匹配英文字符和数字。[\s*]表示空格或者*号。

{}一般用来表示匹配的长度，比如 \s{3} 表示匹配三个空格，\s{1,3}表示匹配一到三个空格。

(0-9) 匹配 '0-9′ 本身。 [0-9]* 匹配数字（注意后面有 *，可以为空）[0-9]+ 匹配数字（注意后面有 +，不可以为空）{1-9} 写法错误。

[0-9]{0,9} 表示长度为 0 到 9 的数字字符串。



## 浏览器

### 浏览器渲染

1. 静态资源并不是同时请求的，也不是解析到指定标签的时候才去请求的，浏览器会自行判断；
2. JS 会阻塞页面的解析和渲染，同时浏览器也存在预解析，遇到阻塞可以继续解析下面的元素；
3. CSS 不阻塞dom树的构建解析，只会阻塞其后面元素的渲染，不会阻塞其前面元素的渲染；
4. 图片既不阻塞解析，也不阻塞渲染。



### 重绘和回流

重绘是当节点需要更改外观而不影响布局，改变color就为重绘

回流是布局或者几何属性需要改变

回流必定发生重绘



### 输入URL到页面展示

1、浏览器从地址栏的输入中进行DNS查询，获得服务器的 IP 地址和端口号

2、浏览器用 TCP 的三次握手与服务器建立连接

3、浏览器向服务器发送HTTP请求

4、服务器收到报文后处理请求，同样拼好报文再发给浏览器

5、浏览器解析报文，渲染输出页面

渲染过程  **DOM -> CSSOM -> render -> layout -> print**

1、根据HTML结构生成DOM树

2、根据CSS生成CSSOM

3、将DOM和CSSOM整合形成RenderTree

4、根据RenderTree开始渲染

5、遇到`script`标签，会执行并阻塞渲染



### 跨域

浏览器出于安全考虑，有同源策略，也就是协议+域名+端口号要相同。

1、jsonp

用`script`加载get请求地址，把回调函数名告诉后端，让后端返回`callback(data)`，这样就可以执行这个回调函数了，不过这个函数名是全局变量的

2、CORS

服务端设置 `Access-Control-Allow-Origin` 就可以开启 CORS

3、postMessage



## 性能优化

- 减少DOM的访问次数，可以将DOM缓存到变量中；
- 减少**重绘**和**回流**，任何会导致**重绘**和**回流**的操作都应减少执行，可将**多次操作合并为一次**；
- 尽量采用**事件委托**的方式进行事件绑定，避免大量绑定导致内存占用过多；
- css层级尽量**扁平化**，避免过多的层级嵌套，尽量使用**特定的选择器**来区分；
- 动画尽量使用CSS3**动画属性**来实现，开启GPU硬件加速；
- 图片在加载前提前**指定宽高**或者**脱离文档流**，可避免加载后的重新计算导致的页面回流；
- css文件在`<head>`标签中引入，js文件在`<body>`标签中引入，优化**关键渲染路径**；
- 加速或者减少HTTP请求，使用**CDN加载静态资源**，合理使用浏览器**强缓存**和**协商缓存**，小图片可以使用**Base64**来代替，合理使用浏览器的**预取指令prefetch**和**预加载指令preload**；
- 压缩混淆代码**，**删除无用代码**，**代码拆分**来减少文件体积；**
- 小图片使用雪碧图**，图片选择合适的**质量**、**尺寸**和**格式**，避免流量浪费。
- 减少关键资源的个数和大小（`Webpack`拆/合包，懒加载等）
- 图片懒加载



## 项目代码、样式规范管理

- 跟UI对接，开发相应的全局组件，在业务模块中统一使用，不得重复造轮子
- 全局scss变量、scss函数管理样式
- eslint、prettier、precommit
- 任何人如果修改了全局scss变量、scss函数，都需要在文档上声明
- 制定编码规范，命名规范，并提供相关文档
- 统一vscode插件，统一vscode插件配置json
- 定期code review，记录不合理地方和表扬优雅的代码
- 提供项目基线版本，项目目录结构一致

### Code Review

- 命名混乱
- div节点冗余
- css冗余
- 过多的if else
- 全局组件带有子模块业务代码
- 注释太少，data变量注释要带上

## 工程架构能力

### 脚手架

开发了一款公司内部使用的脚手架

1、创建项目

2、快速启动cz-customizable

3、初始化开发环境

4、执行脚本

5、版本升级



### 框架搭建

搭建项目基础框架

1、符合规范的组织结构

2、提供常用工具的配置 prettier、eslint、husky

3、集成内部组件库

4、配置文件读取写入

5、自动加载全局组件&vuex modules

6、eventBus 解决方案

7、svg 图标

8、hjson

10、ie 11

11、bable 可选链

12、gzip

13、dart-sass

14、jest



### 微前端系统设计

1、single-spa，systemjs 接入

2、api设计，命名？兼容旧版本都需要考虑

3、设计系统初始化的整个链路，各个模块间的联系(在子系统加载前要拿到一些信息)



#### 状态管理

主应用和子应用如何共享状态？

自研了一个状态管理器，叫mircoStore，类似vuex的使用方式，存储全局状态

#### 样式管理

为了避免样式冲突，每个子应用都有一个css命名空间，就是id，在singeSpaVue的选项中传入，在调用的时候添加上

#### 注册应用

模块注册使用systemjs，因为模块加载是用了systemjs

single-spa注册应用，在回调函数中让systemjs加载子应用

#### 全局组件复用

全局组件统一在main-app上注册，也是主应用

一定要加载完主应用再去加载子应用

#### 抽离共同依赖

webpack externals 依赖，比如vue这些

这些都是用script标签进行加载，所以这些都是全局的

还有一些工具库也是通过这种方式加载，用rollup打包成umd方式

#### 权限控制

权限控制是主要是采用动态addRoutes的方式，跟单体应用略有不同

在main-app加载之前，也就是在single-spa生命周期bootstrap中，进行资源加载

资源包括了地图资源、路由资源这些，获取到这些资源之后，都放到microStore中

在子应用的挂载前，同样也是bootstrap中，读取对应子应用的路由权限，动态addRoutes
