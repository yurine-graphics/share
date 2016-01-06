var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();


  function Share(dom, data, option) {
    this.dom = util.isString(dom) ? document.querySelector(dom) : dom;
    if(!this.dom || !this.dom.getContext) {
      return;
    }
    this.data = data || [];
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

    var lineWidth = parseInt(self.option.lineWidth) || 1;
    lineWidth = Math.max(lineWidth, 1);
    lineWidth = Math.min(lineWidth, minSize >> 2);
    var lineColor = self.option.lineColor || '#39F';

    var max = 0;
    var min = 0;
    self.data.forEach(function(item) {
      max = Math.max(max, item);
      min = Math.min(min, item);
    });
    var average = parseFloat(self.option.average) || ((max + min) / 2);

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

    var color = this.option.color || '#999';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    context.fillStyle = color;

    this.renderBg(context, padding, width, height, minSize, max, min, average, fontSize, lineHeight, lineWidth, lineColor);
  }
  Share.prototype.renderBg = function(context, padding, width, height, minSize, max, min, average, fontSize, lineHeight, lineWidth, lineColor) {
    var gridWidth = parseInt(this.option.gridWidth) || 1;
    gridWidth = Math.max(gridWidth, 1);
    gridWidth = Math.min(gridWidth, minSize >> 2);
    var gridColor = this.option.gridColor || '#EEE';
    var gap = (lineHeight - fontSize) / 2;

    var y0 = padding[0];
    var y1 = (height - padding[0] - padding[2]) * 0.7;
    var y2 = height - padding[0] - padding[2] - lineHeight - 10;
    var y3 = y2 + 10;
    var x1 = padding[3];
    var x2 = width - padding[1] - x1;

    context.fillText('09:30', x1, y3);
    var txt = '15:00';
    var w = context.measureText(txt).width;
    context.fillText(txt, x2 - w, y3);
    txt = '11:30/13:00';
    w = context.measureText(txt).width;
    context.fillText(txt, (x2 - w) / 2, y3);

    var averageWidth = parseInt(this.option.averageWidth) || 1;
    averageWidth = Math.max(averageWidth, 1);
    averageWidth = Math.min(averageWidth, minSize >> 2);
    var averageColor = this.option.averageColor || '#9CF';

    context.lineWidth = averageWidth;
    context.strokeStyle = averageColor;
    context.setLineDash(this.option.averageLineDash || [6, 4]);

    context.beginPath();
    var y = (y1 - y0) / 2 + y0;
    context.moveTo(x1, y);
    context.lineTo(x2, y);
    context.stroke();

    y += gap - lineHeight;
    context.fillText(average.toFixed(2), x1, y);
    txt = '0.00%';
    w = context.measureText(txt).width;
    context.fillText(txt, x2 - w, y);

    context.lineWidth = gridWidth;
    context.strokeStyle = gridColor;
    context.setLineDash(this.option.gridLineDash || [1, 0]);

    context.beginPath();
    var x = (x2 - x1) * 0.5 + x1;
    context.moveTo(x, y0);
    context.lineTo(x, y1);
    context.stroke();

    context.beginPath();
    context.moveTo(x1, y0);
    context.lineTo(x2, y0);
    context.moveTo(x1, y1);
    context.lineTo(x2, y1);
    context.stroke();

    context.fillText(max.toFixed(2), x1, y0 + gap);
    txt = ((max - average) * 0.01).toFixed(2) + '%';
    w = context.measureText(txt).width;
    context.fillText(txt, x2 - w, y0 + gap);
    context.fillText(min.toFixed(2), x1, y1 -lineHeight + gap);
    txt = ((min - average) * 0.01).toFixed(2) + '%';
    w = context.measureText(txt).width;
    context.fillText(txt, x2 - w, y1 - lineHeight + gap);
  }


exports["default"]=Share;
