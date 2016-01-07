define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();


  function Share(dom, data, option) {
    this.dom = util.isString(dom) ? document.querySelector(dom) : dom;
    if(!this.dom || !this.dom.getContext) {
      return;
    }
    this.data = data || {};
    this.data.price = this.data.price || [];
    this.data.volume = this.data.volume || [];
    this.option = option || {};
    this.render();
  }

  Share.prototype.render = function() {
    var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var context = self.dom.getContext('2d');
    var width = self.option.width || 300;
    var height = self.option.height || 150;
    var padding = self.option.padding || [10, 10, 10, 10];
    if(Array.isArray(padding)) {
      switch(padding.length) {
        case 0:
          padding = [10, 10, 10, 10];
          break;
        case 1:
          padding[3] = padding[2] = padding[1] = padding[0];
          break;
        case 2:
          padding[3] = padding[1];
          padding[2] = padding[0];
          break;
        case 3:
          padding[3] = padding[1];
          break;
      }
    }
    else {
      padding = [padding, padding, padding, padding];
    }
    var paddingX = padding[1] + padding[3];
    var paddingY = padding[0] + padding[2];
    var minSize = Math.min(width - paddingX, height - paddingY);

    var max = self.data.price[0] || 0;
    var min = max || 0;
    self.data.price.forEach(function(item) {
      max = Math.max(max, item);
      min = Math.min(min, item);
    });
    var average = parseFloat(self.data.average) || ((max + min) / 2);
    var diff = Math.max(max - average, average - min);

    var font = self.option.font || 'normal normal normal 12px/1.5 Arial';
    (function(){var _1= util.calFont(font);fontStyle=_1["fontStyle"];fontVariant=_1["fontVariant"];fontFamily=_1["fontFamily"];fontWeight=_1["fontWeight"];fontSize=_1["fontSize"];lineHeight=_1["lineHeight"]}).call(this);
    context.textBaseline = 'top';

    if(self.option.fontSize) {
      fontSize = parseInt(self.option.fontSize) || 12;
    }

    if(self.option.lineHeight) {
      lineHeight = self.option.lineHeight;
      if(util.isString(lineHeight)) {
        if(/[a-z]$/i.test(lineHeight)) {
          lineHeight = parseInt(lineHeight);
        }
        else {
          lineHeight *= fontSize;
        }
      }
      else {
        lineHeight *= fontSize;
      }
    }
    else {
      lineHeight = fontSize * 1.5;
    }
    lineHeight = Math.max(lineHeight, fontSize);

    font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px/' + lineHeight + 'px ' + fontFamily;
    context.font = font;

    this.renderFg(context, padding, width, height, minSize, max, min, average, diff, fontSize, lineHeight);
  }
  Share.prototype.renderFg = function(context, padding, width, height, minSize, max, min, average, diff, fontSize, lineHeight) {
    var y0 = padding[0];
    var y1 = (height - padding[0] - padding[2]) * 0.7 + y0;
    var y2 = height - padding[0] - padding[2] - lineHeight;
    this.renderLine(context, padding, width, minSize, average, diff, y0, y1, y2);
    this.renderVolume(context, padding, width, y1, y2);
    this.renderRuler(context, padding, width, height, minSize, max, min, average, diff, fontSize, lineHeight, y0, y1, y2);
  }
  Share.prototype.renderLine = function(context, padding, width, minSize, average, diff, y0, y1, y2) {
    var length = 240;
    var stepX = (width - padding[1] - padding[3]) / (length - 1);
    var stepY = (y1 - y0) / (diff * 2);
    var coords = this._coords = [];
    this.data.price.forEach(function(num, i) {
      var arr = [];
      if(num === null || num === undefined) {
        var last = coords[i - 1];
        arr.push(last ? last.slice(0) : null);
      }
      else {
        var x = padding[3] + stepX * i;
        var y = y0 + (average + diff - num) * stepY;
        arr.push(x);
        arr.push(y);
      }
      coords.push(arr);
    });

    var lineWidth = parseInt(this.option.lineWidth) || 1;
    lineWidth = Math.max(lineWidth, 1);
    lineWidth = Math.min(lineWidth, minSize >> 2);
    var lineColor = this.option.lineColor || '#3CF';
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.setLineDash([1, 0]);

    var color = util.rgb2int(this.option.areaColor || 'rgb(232, 246, 252)');
    var opacity = parseFloat(this.option.opacity) || 0.5;
    var gr = context.createLinearGradient(0, y1, 0, y2);
    gr.addColorStop(0, 'rgba(' + color.join(',') + ',' + opacity + ')');
    gr.addColorStop(1, 'rgba(' + color.join(',') + ',' + opacity / 2 + ')');

    switch(this.option.style) {
      case 'curve':
        this.renderCurve(context, coords, y0, y1, y2, color, opacity, gr);
        break;
      default:
        this.renderStraight(context, coords, y1, y2, color, opacity, gr);
        break;
    }
  }
  Share.prototype.renderCurve = function(context, coords, y0, y1, y2, color, opacity, gr) {
    if(coords.length) {
      var clone = [];
      coords.forEach(function(item) {
        if(item !== null && item !== undefined) {
          clone.push(item);
        }
      });
      var centers = [];
      for(var i = 0, len = clone.length; i < len - 1; i++) {
        var item1 = clone[i];
        var item2 = clone[i + 1];
        centers.push([
          (item1[0] + item2[0]) >> 1,
          (item1[1] + item2[1]) >> 1
        ]);
      }
      var curvature = parseFloat(this.option.curvature);
      if(isNaN(curvature)) {
        curvature = 1;
      }
      curvature = Math.max(curvature, 0);
      curvature = Math.min(curvature, 1);
      var ctrols = [];
      for(var i = 0, len = centers.length; i < len - 1; i++) {
        var item1 = centers[i];
        var item2 = centers[i + 1];
        var item = clone[i + 1];
        var center = [
          (item1[0] + item2[0]) >> 1,
          (item1[1] + item2[1]) >> 1
        ];
        var diffX = (center[0] - item[0]);
        var diffY = (center[1] - item[1]);
        ctrols.push([
          item1[0] - diffX * curvature,
          Math.min(y1, Math.max(y0, item1[1] - diffY * curvature)),
          item2[0] - diffX * curvature,
          Math.min(y1, Math.max(y0, item2[1] - diffY * curvature))
        ]);
      }

      context.beginPath();
      var start = clone[0];
      var end = clone[clone.length - 1];
      context.moveTo(start[0], start[1]);
      context.quadraticCurveTo(ctrols[0][0], ctrols[0][1], clone[1][0], clone[1][1]);
      for(var i = 2, len = clone.length; i < len - 1; i++) {
        var left = ctrols[i-2];
        var right = ctrols[i-1];
        context.bezierCurveTo(left[2], left[3], right[0], right[1], clone[i][0], clone[i][1]);
      }
      var ctrl = ctrols[i-2];
      context.quadraticCurveTo(ctrl[2], ctrl[3], end[0], end[1]);
      context.stroke();

      context.fillStyle = 'rgba(' + color.join(',') + ',' + opacity + ')';
      context.lineTo(end[0], y1);
      context.lineTo(start[0], y1);
      context.lineTo(start[0], y1);
      context.fill();
      context.closePath();

      context.fillStyle = gr;
      context.beginPath();
      context.moveTo(start[0], y1);
      context.lineTo(end[0], y1);
      context.lineTo(end[0], y2);
      context.lineTo(start[0], y2);
      context.lineTo(start[0], y1);
      context.fill();
      context.closePath();
    }
  }
  Share.prototype.renderStraight = function(context, coords, y1, y2, color, opacity, gr) {
    if(coords.length) {
      context.beginPath();
      var start;
      var end;
      for(var i = 0, len = coords.length; i < len; i++) {
        var item = coords[i];
        if(item === null || item === undefined) {
          continue;
        }
        if(start) {
          context.lineTo(item[0], item[1]);
        }
        else {
          start = item;
          context.moveTo(item[0], item[1]);
        }
        end = item;
      }
      context.stroke();

      context.fillStyle = 'rgba(' + color.join(',') + ',' + opacity + ')';
      context.lineTo(end[0], y1);
      context.lineTo(start[0], y1);
      context.lineTo(start[0], y1);
      context.fill();
      context.closePath();

      context.fillStyle = gr;
      context.beginPath();
      context.moveTo(start[0], y1);
      context.lineTo(end[0], y1);
      context.lineTo(end[0], y2);
      context.lineTo(start[0], y2);
      context.lineTo(start[0], y1);
      context.fill();
      context.closePath();
    }
  }
  Share.prototype.renderVolume = function(context, padding, width, y1, y2) {
    var color = this.option.volumeColor || '#79C';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    context.fillStyle = color;

    var stepX = (width - padding[1] - padding[3]) / 479;
    var max = this.data.volume[0] || 0;
    this.data.volume.forEach(function(num) {
      max = Math.max(max, num);
    });
    var diff = y2 - y1;
    var stepY = diff / max;

    this.data.volume.forEach(function(num, i) {
      var x = padding[3] + i * stepX * 2;
      var h = stepY * num;
      var y = y2 - h;
      context.fillRect(x, y, stepX, h);
    });
  }
  Share.prototype.renderRuler = function(context, padding, width, height, minSize, max, min, average, diff, fontSize, lineHeight, y0, y1, y2) {
    var color = this.option.color || '#999';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    context.fillStyle = color;

    var gridWidth = parseInt(this.option.gridWidth) || 1;
    gridWidth = Math.max(gridWidth, 1);
    gridWidth = Math.min(gridWidth, minSize >> 2);
    var gridColor = this.option.gridColor || '#DDD';
    var gap = (lineHeight - fontSize) / 2;

    var y3 = y2 + 10;
    var x0 = padding[3];
    var x1 = width - x0;

    context.lineWidth = gridWidth;
    context.strokeStyle = gridColor;
    context.setLineDash(this.option.gridDash || [1, 0]);

    context.beginPath();
    var x = (x1 - x0) * 0.5 + x0;
    context.moveTo(x, y0);
    context.lineTo(x, y1);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y0);
    context.moveTo(x0, y1);
    context.lineTo(x1, y1);
    context.moveTo(x0, y2);
    context.lineTo(x1, y2);
    context.stroke();
    context.closePath();
    context.fillText('09:30', x0, y3);
    var txt = '15:00';
    var w = context.measureText(txt).width;
    context.fillText(txt, x1 - w, y3);
    txt = '11:30/13:00';
    w = context.measureText(txt).width;
    context.fillText(txt, (x1 - w) / 2, y3);

    var averageWidth = parseInt(this.option.averageWidth) || 1;
    averageWidth = Math.max(averageWidth, 1);
    averageWidth = Math.min(averageWidth, minSize >> 2);
    var averageColor = this.option.averageColor || '#C6C';

    context.lineWidth = averageWidth;
    context.strokeStyle = averageColor;
    context.setLineDash(this.option.averageDash || [6, 4]);

    context.beginPath();
    var y = (y1 - y0) / 2 + y0;
    context.moveTo(x0, y);
    context.lineTo(x1, y);
    context.stroke();
    context.closePath();

    context.shadowColor = 'rgba(0,0,0,0.1)';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 2;

    y += gap - lineHeight;
    context.fillText(average.toFixed(2), x0, y);
    txt = '0.00%';
    w = context.measureText(txt).width;
    context.fillText(txt, x1 - w, y);

    context.fillText(max.toFixed(2), x0, y0 + gap);
    txt = (diff * 100 / average).toFixed(2) + '%';
    w = context.measureText(txt).width;
    context.fillText(txt, x1 - w, y0 + gap);
    context.fillText(min.toFixed(2), x0, y1 -lineHeight + gap);
    txt = (-diff * 100 / average).toFixed(2) + '%';
    w = context.measureText(txt).width;
    context.fillText(txt, x1 - w, y1 - lineHeight + gap);
  }

  var _2={};_2.coords={};_2.coords.get =function() {
    return this._coords;
  }
Object.keys(_2).forEach(function(k){Object.defineProperty(Share.prototype,k,_2[k])});

exports["default"]=Share;
});