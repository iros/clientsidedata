$.fn.extend({

  makeSparkline : function(data) {
    this.sparkline(data, {
      type : 'bar',
      fillColor : "blue",
      chartRangeMin : _.min(data),
      chartRangeMax : _.max(data),
      barWidth : this.parent().width()/(data.length+1),
      height : 70
    });
  },

  makePie : function(classname, superpower, type) {
    this.find(classname).sparkline([superpower[type], 100 - superpower[type]],{
      sliceColors : [type === "hero" ? 'green' : 'red', '#ddd'],
      type : 'pie',
      tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{value}}%'
    });
  }

});