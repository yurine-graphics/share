# yurine-share

线图line，`yurine`取名自`鴉-KARAS-`中的城市精灵百合音。

[![NPM version](https://badge.fury.io/js/yurine-share.png)](https://npmjs.org/package/yurine-share)

# INSTALL
```
npm install yurine-share
```

[![preview](https://raw.githubusercontent.com/yurine-graphics/share/master/preview.png)](https://github.com/yurine-graphics/share)

# API
 * Line(selector:DOM/String, data:\<\<String>, \<int>>, option:Object):Class
   * selector:String 渲染的canvas对象或选择器
   * data:Object 渲染数据
     - price:\<Number> 价格数据数组
     - volume:\<Number> 成交手数据数组
     - average:Number 均价或昨收
   * option:Object 选项
     - font:String 文字字体css缩写
     - fontFamily:String 文字字体，会覆盖font
     - fontWeight:String 文字粗细，会覆盖font
     - fontVariant:String 文字异体，会覆盖font
     - fontStyle:String 文字样式，会覆盖font
     - fontSize:int 文字大小，单位px，会覆盖font
     - lineHeight:String/int 行高，单位px，会覆盖font
     - padding:int/Array 边距，上右下左，单位px
     - width:int 宽度，单位px
     - height:int 高度，单位px
     - lineWidth:int 绘线粗细，单位px，∈\[1, 可视半径]，默认1
     - lineColor:String 绘线颜色
     - areaColor:STring 绘线下方区域颜色
     - areaOpacity:Number 绘线下方区域透明度，∈\[0, 1]，默认0.5
     - averageWidth:int 均线粗细，单位px，∈\[1, 可视半径]，默认1
     - averageColor:String 均线颜色
     - averageDash:Array<int> 均线虚线样式，默认\[6, 4]
     - gridWidth:int 背景网格线粗细，单位px，∈\[1, 可视半径]，默认1
     - gridColor:String 背景网格颜色
     - gridDash:Array<int> 背景网格虚线样式，默认\[1, 0]
     - volumeColor:String 圆柱颜色
     - curvature:float 曲线曲率，∈\[0, 1]
     - style:\<String> 绘线类型，取值curve、straight，默认straight
 * getCoords():\<Array> 获取绘制点的坐标，是个二维数组，包含所有线条
 * getCoord(index:int):\<Array> 获取第index线条的所有坐标，-1从末尾起
 * getPoint():\<x:Number, y:Number> 获取第index线条的第x点的纵坐标，-1从末尾起

# License
[MIT License]
