# 2018

## Aug

### 20

加载blob流图片

```JavaScript
var img = new Image();
img.src = window.URL.createObjectURL(this._blob);
img.onload = function() {
  // 获取图片原始尺寸
  var imgWidth = this.naturalWidth;;
  var imgHeight = this.naturalHeight;
  window.URL.revokeObjectURL(img.src);
};
```

### 21

```JavaScript
!!"false" => true(Boolean)
!!undefined => false
!!123 || !!’abc’ => true
!!是转Boolean的一个技巧，可以得到这个值真正对应的布尔值
```