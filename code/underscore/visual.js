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
  var data = [{ name : "heroes", value : _.mean(hero_heights) }, {
    name : "villains", value: _.mean(villain_heights) }];

  function makeCircles(elm, data) {
    var width = 600, height = 300;
    var posScale = d3.scale.linear()
      .range([width/(data.length+1), width - width/(data.length+1)])
      .domain([0,data.length-1]);

    var chart = d3.select(elm)
      .text("")
      .style({ width : width, height : height })
      .append("svg");
      
      chart.selectAll("circle")
      .data(data).enter()
        .append("circle")
        .style("fill", "steelblue")
        .attr("cx", function(d, i) { 
          return posScale(i);
        })
        .attr("cy", height / 2 )
        .attr("r", function(d) { 
          return Math.sqrt(d.value/Math.PI) * 6; 
        });

      // append value
      chart.selectAll("text")
      .data(data).enter()
        .append("text")
        .attr("x", function(d, i) { 
          return posScale(i);
        })
        .attr("y", height / 2)
        .attr("font-size", 14)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function(d) { return d.name + ": " + Math.round(d.value); });
  }
  
  makeCircles("#heroes", data);
  
  // same for gender!
  var male_heroes = _.chain(heroes).filter(function(hero) {
    return hero.Gender === 'male' && hero.Height_cm !== "NA";
  }).pluck("Height_cm").value(),
  female_heroes = _.chain(heroes).filter(function(hero) {
    return hero.Gender === 'female' && hero.Height_cm !== "NA";
  }).pluck("Height_cm").value(),
  unknown = _.chain(heroes).filter(function(hero) {
    return hero.Gender === 'female' && hero.Height_cm !== "NA";
  }).pluck("Height_cm").value();

  data = [
    { name : "male" , value : _.mean(male_heroes)}, 
    { name : "female" , value : _.mean(female_heroes)}, 
    { name : "?" , value : _.mean(unknown)}
  ];
  
  makeCircles("#heroes2", data);
});

 


