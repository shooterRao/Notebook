# arcgis js api 记录

## Map

所有类都有共用 map 对象

map: "esri/map"
centerAndZoom (point,级别);
toMap （转为地图坐标）
toScreen （转为屏幕坐标）

Graphic symbol attributes

Querytask query
IdentifyTask
Buffer
Geometryservices..

## 查询服务地址

一般为静态服务+'/0'

## 根据 id 获取 layer

this.map.getLayer(layerobj.serviceuid)
this.map.layerIds (地图已加载的图层 ID 列表)

## createSymbol

```js
function createMarkerSymbol(path, color) {
  var markerSymbol = new SimpleMarkerSymbol();
  markerSymbol.setPath(path);
  markerSymbol.setColor(new dojo.Color(color));
  markerSymbol.setSize(24);
  markerSymbol.setOutline(null);
  return markerSymbol;
}
```

## 查询

```js
var query = new Query();
var queryUrl =“XXX/0";
var queryTask = new QueryTask(queryUrl);
var where = xxx;
query.spatialRel = "sriSpatialRelIntersects";
query.where = "NAME like '%" + where + "%'";
query.returnGeometry = true;// 返回地理信息
query.outFields = ["*”];// 所有字段
queryTask.execute(Query,function(){})
```

## 查出结果，获取地理信息

```js
resultGraphic.geometry.getExtent();
```

## 获取地理信息中心点

```js
resultGraphic.geometry.getExtent().getCenter();
```

## 查询

```js
// 模糊查询
query.where = "NAME like '%" + where + "%’";

// 精确查询
query.where = "NAME =" + "\'" + text + "\'";
query.where ="CASETYPE = '” + name + "' and SECTION-NAME = '” + this.branchName + "' ";
```

## 2018/06/20

1.同 id 的 graphicLayer 图层只能添加一次，不能重复添加，不然无法添加 graphic 到该 graphicLayer 上

2.关于图层放大(定位到指定坐标)，坐标又是经过 this.map.toMap(screen 的)，然后出现偏移的问题，解决办法是先进行图层放大，然后再进行坐标转换，最后进行定位

3.关于定位和 infoWindow show 时，控制台会出现一堆报错信息，原因是地图定位到某个点时，定位是异步的，图层还是移动，infoWindow 的 show 方法是同步的，图层未移动完成直接执行 infoWindow 的 show 方法会找不到指定的点。解决办法是 this.map.centerAt(xxx).then(function(){ infoWindow.show() })

## 面积计算

```js
function calculateAreaByGeometry(geometries) {
  var areasAndLengthParams = new AreasAndLengthsParameters();
  areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;
  areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
  this._geoService.simplify([geometries],lang.hitch(this, functio (simplifiedGeometries) {
      areasAndLengthParams.polygons = simplifiedGeometries;
      this._geoService.areasAndLengths(areasAndLengthParams, lang.hitch(this, function(measurements){
        console.log("计算："+JSON.stringify(measurements));
        this._originArea = measurements.areas[0].toFixed(3);;
        this.LandArea.innerHTML = this._originArea;
        this.LandArea.value = this._originArea;
    }));
  }));
},
```

## 格式化返回数据格式 cad

```js
function formateCadData(rendererInfo) {
  for(var key in rendererInfo){
    if(key.indexOf("Annotation") >= 0){
      var _Annotation = key;
    }else if(key.indexOf("MultiPatch") >= 0){
      var _Multipatch = key;
    }else if(key.indexOf("Point") >= 0){
      var _Point = key;
    }else if(key.indexOf("Polygon") >= 0){
      var _Polygon = key;
    }else if(key.indexOf("Polyline") >= 0){
      var _Polyline = key;
  }
}
this._tempSOEArray = [];
if(_Annotation != null && _Annotation != "")
  this._tempSOEArray.push({key:_Annotation,label:"Annotation",renderer:rendererInfo[_Annotation]});
if(_Point != null && _Point != "")
  this._tempSOEArray.push({key:_Point,label:"Point",renderer:rendererInfo[_Point]});
if(_Multipatch != null && _Multipatch != "")
  this._tempSOEArray.push({key:_Multipatch,label:"MultiPatch",renderer:rendererInfo[_Multipatch]});
if(_Polygon != null && _Polygon != "")
  this._tempSOEArray.push({key:_Polygon,label:"Polygon",renderer:rendererInfo[_Polygon]});
if(_Polyline != null && _Polyline != "")
  this._tempSOEArray.push({key:_Polyline,label:"Polyline",renderer:rendererInfo[_Polyline]});
//console.log(this._tempSOEArray);
}
```

## 生成气泡

```js
function _createMarkerSymbol(path, color) {
  var markerSymbol = new SimpleMarkerSymbol();
  markerSymbol.setPath(path);
  markerSymbol.setColor(new dojo.Color(color));
  markerSymbol.setSize(24);
  markerSymbol.setOutline(null);
  return markerSymbol;
}

var bubblePath =
  "M112.383743,306.206395 C205.990914,190.501802 240.139288,110.391573 214.974178,65.98601 C191.75978,25.0226106 152.205437,0.518809731 112.001211,0.890603622 C72.6760715,1.25426804 33.6638005,25.2983572 8.95967556,65.9989251 C-17.1771425,109.059885 17.2454444,189.168363 112.383743,306.206395 Z";
var initColor = "#0084ff";
// 生成气泡symbol
var bubbleSymbol = _createMarkerSymbol(bubblePath, initColor);

// 通用symbol样式
var polygonSys = {
  style: "esriSFSSolid",
  color: [79, 129, 189, 128],
  type: "esriSFS",
  outline: {
    style: "esriSLSSolid",
    color: [255, 0, 0, 125],
    width: 3,
    type: "esriSLS"
  }
};
var pointSys = {
  style: "esriSMSCircle",
  color: [0, 0, 128, 128],
  name: "Circle",
  outline: {
    color: [0, 0, 128, 255],
    width: 1
  },
  type: "esriSMS",
  size: 18
};
var lineSys = {
  style: "esriSLSSolid",
  color: [255, 0, 0, 255],
  width: 1,
  name: "Red 1",
  type: "esriSLS"
};
if (!this.pointSymbol) {
  this.pointSymbol = jsonUtils.fromJson(pointSys);
}
if (!this.polylineSymbol) {
  this.polylineSymbol = jsonUtils.fromJson(lineSys);
}
if (!this.polygonSymbol) {
  this.polygonSymbol = jsonUtils.fromJson(polygonSys);
}
```

## 加入图层

```js
this.identifyGraphicLayer.add(currentGra);
// 一闪一闪graphic
dgpUtils.featureAction.flash([currentGra], this.identifyGraphicLayer);
// 定位
dgpUtils.featureAction.zoomTo(this.map, [currentGra], { extentFactor: "2" });
this.map.setExtent(geometry.getExtent().expand(2));
```

## 导出 excel

```js
function exportToExecl() {
var filename = this.exportData.layerName,
tableId = this.baseClass + '-table',
tableDataSource = this.exportData.feature.attributes;
// console.log(this.exportData);
var table = document.getElementById(tableId);
if (!table) {
  table = domCon.create('table', {
  'id': tableId,
  'style': {
  'display': 'none'
  }
}, this.domNode);
}
this.exportTable = table;
var thead = domCon.create('thead', null, table),
theadTr = domCon.create('tr', null, thead),
tbody = domCon.create('tbody', null, table),
tbodyTr = domCon.create('tr', null, tbody);
array.forEach(Object.keys(tableDataSource), function (key) {
  domCon.create('th', { innerHTML: key }, theadTr);
  var value = lang.trim(tableDataSource[key] + '');
  domCon.create('td', { innerHTML: value }, tbodyTr);
  }, this);
  ExportToExcel([tableId], [filename], filename);
  domCon.empty(table);
}
```

## I 查询

```js
_IdentifyOneByOne: function (geometry, index) {
var QueryConfig = this.config.queryconfig;
var layerItem = QueryConfig[index];
var _this = this;
var identifyTask = new IdentifyTask(layerItem.URL);
var identifyParams = new IdentifyParameters();
identifyParams.tolerance = 1;
identifyParams.returnGeometry = true;
identifyParams.spatialReference = _this.map.extent.spatialReference;
identifyParams.geometry = geometry;
// layerIds ‘[1,2]‘ 传入图层Id
identifyParams.layerIds = layerItem.queryLayers;
identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
identifyParams.mapExtent = _this.map.extent;
identifyTask.execute(identifyParams, lang.hitch(this, function (results) {
if (results.length > 0) {
  _this.isResult = true;
  var data = new Object();
  data.results = results;
  data.layerItem = layerItem;
  _this._dataClassification(data);
}
if ((index + 1) < QueryConfig.length) {
  _this._IdentifyOneByOne(geometry, index + 1);
} else {
  _this._showQueryResult();
}
}));
},
```

## 绘制缓冲区

```js
function doBuffer(bufferRange) {
//缓冲区查询返回新的geometry
var bufferParams = new BufferParameters();
var geometry = this._beforeBufferGeometry;
bufferParams.distances = [bufferRange];// 距离
bufferParams.outSpatialReference = this.map.spatialReference;
bufferParams.geometries = [geometry];// geometry
bufferParams.unit = GeometryService.UNIT_METER;
this._geoService.buffer(bufferParams, lang.hitch(this, function (results) {
  if (results.length) {
    var bufferGeometry = results;
    this._showBufferGeometry(bufferGeometry); //展示缓冲区域
    this._bufferGeometry = bufferGeometry;
  }
  }))
},
```

## 获取打开的专题

```js
this.topicManager.getOpenedTopics(),
```

## 关于调用 SOE 服务，如何传 rings？

绘制完成后，如果要加缓冲区，先调用计算缓冲区的服务，计算出根据绘制后的 geometry 和当前的缓冲范围，再配置参数传给 SOE

```js
// 核心代码
var bufferParams = new BufferParameters();
var geometry = this._bufferGeometry; // 绘制的几何信息
bufferParams.distances = [bufferRange];
bufferParams.outSpatialReference = this.map.spatialReference;
bufferParams.geometries = [geometry];
bufferParams.unit = GeometryService.UNIT_METER;
// 计算缓存区，得到几何信息
this._geoService.buffer(
  bufferParams,
  lang.hitch(this, function(results) {
    if (results.length) {
      var bufferGeometry = results;
      // 展示缓冲区域
      this._showBufferGeometry(bufferGeometry);
      this._bufferGeometry = bufferGeometry;
    }
  })
);
```

<ToTop/>