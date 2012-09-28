// This example is utilizing the great adjacency matrix visualization
// here: http://bost.ocks.org/mike/miserables/

// Instantiate a new Miso Dataset object and point it
// at a csv file containing the co-occurance matrix.
var cooccuranceMatrix = new Miso.Dataset({
  url: '../../data/superpower_edges.csv',
  delimiter: ";"
});

// fetch data
cooccuranceMatrix.fetch().then(function() {

  _.extend(Miso.Dataset.DataView.prototype, {

    /**
    * build the d3 required format that looks like so:
    * {
    *   nodes : [
    *     { name : "Batman" },
    *     ...
    *   ],
    * 
    *   links : [
    *     { source : 1, target : 2, value : 3 },
    *     ...
    *   ]
    * }
    * Note this doesn't return any form of Dataset... it's simply a
    * serialization helper, like toJSON.
    */
    toGraph : function(columnsCol, columns) {
      var g = {
        nodes : [],
        links : []
      };

      var _positions = {};
      
      // First create our nodes by just pushing them into the array
      // also cache the positions so that when we build the source<->target
      // mapping, we can easily find the actual index position based on the name.
      _.each(columns, function(c, i) {
        _positions[c] = i;
        g.nodes.push({ name : c });
      });

      // Build the actual links. Iterate over each row and then each
      // of the co-occurance columns. As long as the column in question is
      // one of the columns we're building a graph for, push the value in
      // the adjacency matrix
      this.each(function(row, source) {

        _.each(this.columnNames(), function(c, j) {
          if (columns.indexOf(c) > -1) {
            if (row[c] > 0) {
              var link = { source : source };
              link.target = columns.indexOf(c);
              link.value = row[c];
              g.links.push(link);
            }
          }
          
        }, this);

      },this);

      return g;
    }

  });
  
  // get all the super power column names
  var superPowers = _.filter(cooccuranceMatrix.columnNames(), function(name) {
    return (/superpower/).test(name);
  });

  var coOccurance = cooccuranceMatrix;
  var graph = coOccurance.toGraph("Column", superPowers);


  // d3 time =====
  // this builds the actual visualization and is about 80% of
  // the code written by mbostock in the link above.

  var margin = {top: 80, right: 0, bottom: 10, left: 80},
    width = 1024,
    height = 1024;

  var x = d3.scale.ordinal().rangeBands([0, width]),
    z = d3.scale.pow().exponent(0.5).range([0.1,1.0]).clamp(true),
    c = d3.scale.category10().domain(d3.range(10));

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var matrix = [],
      nodes = graph.nodes,
      n = nodes.length;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });


  // Convert links to matrix; count character occurrences.
  var maxZ = 0,
    values = [];
  graph.links.forEach(function(link) {
    values.push(link.value);
    matrix[link.source][link.target].z = link.value;
    matrix[link.target][link.source].z = link.value;
    nodes[link.source].count += 1;
    nodes[link.target].count += 1;
    if (link.value > maxZ) {
      maxZ = link.value;
    }
  });

  console.log(values);
  z.domain([0, maxZ]);

  // Precompute the orders.
  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
  };

  // The default sort order.
  x.domain(orders.name);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  function buildRow(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return "blue"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
  }

  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(buildRow);

  row.append("line")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return nodes[i].name.slice(11).split("_").join(" "); });

  var column = svg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -width);

  column.append("text")
      .attr("x", 6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name.slice(11).split("_").join(" "); });

  
  function mouseover(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i === p.y; });
    d3.selectAll(".column text").classed("active", function(d, i) { return i === p.x; });
    console.log(p);
  }

  function mouseout() {
    d3.selectAll("text").classed("active", false);
  }

  var timeout;
  d3.select("#order").on("change", function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    order(this.value);
  });

  function order(value) {
    x.domain(orders[value]);

    var t = svg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  }





});