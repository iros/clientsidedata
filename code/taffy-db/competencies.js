// fetch our hero json file...
$.get('../../data/all.json', function(heroes) {

  // create a database of heroes
  heroes = TAFFY(heroes);
 
  // find all heroes that have all their ability scores.
  var heroes_with_competencies = heroes({
      combat : { isUndefined : false },
      power :  { isUndefined : false },
      durability :  { isUndefined : false },
      intelligence : { isUndefined : false },
      speed :  { isUndefined : false },
      strength : { isUndefined : false }
  });

  // build scatterplot!
  var height = 400, 
      width = 400, 
      r = 4,
      y_attr = $('#ySelect').val(), 
      x_attr = $('#xSelect').val();

  var chart = d3.select("#scatterplot")
    .style('width', width)
    .style('height', height)
    .append('svg');

  var heightRange = d3.scale.linear()
    .domain([
      heroes_with_competencies.min(y_attr), 
      heroes_with_competencies.max(y_attr)
    ])
    .range([height - 16 - r,0 + r]);

  var widthRange = d3.scale.linear()
    .domain([
      heroes_with_competencies.min(x_attr),
      heroes_with_competencies.max(x_attr)
    ])
    .range([24, width-r]);

  // make x axis
  var xAxis = d3.svg.axis()
    .scale(widthRange)
    .orient('bottom')
    .tickSize(1)
    .ticks(10);

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + (height - 20) + ")")
    .call(xAxis);

  // make y axis
  var yAxis = d3.svg.axis()
    .scale(heightRange)
    .orient('left')
    .tickSize(1)
    .ticks(10);
  window.c = chart;
  chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(24,0)")
    .call(yAxis);

  // start drawing dots
  var dots = chart.append("g")
    .attr("class", "dots")
    .selectAll("circle")
    .data(heroes_with_competencies.get())
    .enter()
      .append("circle")
      .attr("type", function(d) {
        return d.type;
      })
      .attr("xv", function(d) {
        return d[x_attr];
      })
      .attr("yv", function(d) {
        return d[y_attr];
      })
      .attr('gender', function(d) {
        return d.Gender;
      })
      .attr("cx", function(d) {
        return widthRange(d[x_attr]);
      })
      .attr("cy", function(d) { 
        return heightRange(d[y_attr]);
      })
      .attr("opacity", "0.3")
      .attr("stroke", "none")
      .attr("fill", function(d) {
        if (d.Gender === "female") {
          return "red";
        } else {
          return "blue";
        }
      })
      .attr("r", r);

  // attach to dropdowns:
  // x axis dropdown
  $('#xSelect').on("change", function(e) {
    x_attr = $(e.target).val();

    widthRange.domain([
      heroes_with_competencies.min(x_attr),
      heroes_with_competencies.max(x_attr)
    ]);

    // reset our x&y values (mostly for debugging)
    dots.attr("xv", function(d) {
        return d[x_attr];
      })
      .attr("yv", function(d) {
        return d[y_attr];
      });

    dots.transition()
      .attr("cx", function(d) {
        return widthRange(d[x_attr]);
      });
  });

   // attach to dropdowns
   // y_axis dropdown
  $('#ySelect').on("change", function(e) {
    y_attr = $(e.target).val();

    heightRange.domain([
      heroes_with_competencies.min(y_attr),
      heroes_with_competencies.max(y_attr)
    ]);

    // reset our x&y values (mostly for debugging)
    dots.attr("xv", function(d) {
        return d[x_attr];
      })
      .attr("yv", function(d) {
        return d[y_attr];
      });
      
    dots.transition()
      .attr("cy", function(d) {
        return heightRange(d[y_attr]);
      });
  });

  // hero type
  $('select#type').on("change", function(e) {
    var s = $(e.target).val();
    $('circle').show();
    if (s === "hero") {
      $('circle[type="villain"]').hide();  
    } else if (s === "villain") {
      $('circle[type="hero"]').hide();  
    }

  });
  // gender selection
  $('select#gender').on("change", function(e) {
    var s = $(e.target).val();
    if (s === "both") {
      // unhide all dots, in case
      $('circle').show();
      dots
        .transition()
        .attr("fill", function(d) {
        if (d.Gender === "female") {
          return "red";
        } else {
          return "blue";
        }
      });
    } else if (s === "female") {
      $('circle').hide();
      $('circle[gender="female"]').show();
      dots
        .transition()
        .attr("fill", "red"); 
    } else if (s === "male") {
      $('circle').hide();
      $('circle[gender="male"]').show();
      dots
        .transition()
        .attr("fill", "blue");
    } else {
      // unhide all dots, in case
      $('circle').show();
      dots
        .transition()
        .attr("fill", "#000");
    }
  });
});