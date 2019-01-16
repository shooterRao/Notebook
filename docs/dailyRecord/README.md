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

方案1：

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

方案2：

`<Menu v-if="menuData.length !== 0"/>`

### 滚动进度条核心代码

::: tip 原理
视口滚动的距离 / 文档总高度 - 视口高度
:::

```js
// jq
($(window).scrollTop() / ($(document).height() - $(window).height())) * 100

// js
window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100
```

<ToTop/>