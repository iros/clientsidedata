var heroes, villains;

// get the heroes
var heroesDef = $.ajax({ 
  dataType: "json",  
  url : "../../data/just_heroes.json"
}).done(function(data) {
  heroes = data;
});

// get the villains
var villainsDef = $.ajax({ 
  dataType: "json",  
  url : "../../data/just_villains.json"
}).done(function(data) {
  villains = data;
});


$.when(heroesDef, villainsDef).then(function() {
  
  // === modify each record:
  // add a property called hasHeight to each object that marks whether it
  // has a height set or not
  _.each([heroes, villains], function(all) {
    _.each(all, function(hov) {
      if (hov.Height_cm !== "NA" ||
        hov.Height_ft !== "NA") {
        hov.hasHeight = true;

        // convert to number from a string
        hov.Height_cm = +hov.Height_cm;
    
      } else {
        hov.hasHeight = false;
      }
    });
  });
  
  // === find subset of original records
  // find all the heroes that have a height
  var heroes_with_height = _.filter(heroes, function(hero) {
    return hero.hasHeight;
  }),
      villains_with_height = _.filter(villains, function(villain) {
    return villain.hasHeight;
  });

  // === get a new array based on existing collection
  // find all the heights
  var hero_heights = _.pluck(heroes_with_height, "Height_cm"),
      villain_heights = _.pluck(villains_with_height, "Height_cm");
  
  // === Make some circles...
  var data = [_.mean(hero_heights), _.mean(villain_heights)];
  var chart = d3.select("#heroes")
      .text("")
      .style({ width : "400px", height : "700px" })
      .append("svg");
      
      chart.selectAll("circle")
      .data(data).enter()
        .append("circle")
        .style("fill", "steelblue")
        .attr("cx", function(d, i) { return (400 / (i+1)) - d/3; })
        .attr("cy", 150 )
        .attr("r", function(d) { return Math.sqrt(d/Math.PI) * 9; });

      // append value
      chart.selectAll("text")
      .data(data).enter()
        .append("text")
        .attr("x", function(d, i) { return (400 / (i+1)) - d/3; })
        .attr("y", 150)
        .attr("font-size", 25)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function(d) { return Math.round(d); })
  
});

 


