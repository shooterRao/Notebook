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

如果使用alias

```
location /nginx {
  alias /data/www;
  index index.html
}
```

当访问`http://location/nginx`，nginx 会去`/data/www`去找`index.html`，即`/data/www/index.html`
