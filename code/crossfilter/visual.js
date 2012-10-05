// fetch our json file... this time with d3 just for fun.
d3.json("../../data/all.json", function(heroes) {

  // before we pass heroes out to crossfilter, remove those that don't
  // have all competency properties because otherwise we will run into lots of zeroes
  // that weren't meant to be there..
  var competencies = ["intelligence", "combat", "power", "durability", "speed", "strength"], 
      competent_heroes = _.filter(heroes, function(hero) {
        
        // get an array of booleans as to whether the particular
        // competency exists for this hero
        var exists = _.map(competencies, function(c){
          return (typeof hero[c] !== "undefined" && 
                  !_.isNaN(hero[c]));
        });

        // make sure that all competencies are present
        return _.inject(exists, function(v,memo) { 
          return v && memo; 
        }, true);
      });

  // pass the data through the crossfilter
  var heroes_crossfilter = crossfilter(competent_heroes);

  var dim, records, min, max, bin_width, 
      bins, results = {}, intervals = 8,
      global_max = 0, global_min = Infinity;
  _.each(competencies, function(competency) {

    results[competency] = {};

    // === building dimensions
    // build a dimension for this competency
    dim = heroes_crossfilter.dimension(function(hero) {
      return hero[competency];
    });
    
    // === find our min and max
    // get all the recorts (top infinity)
    records = dim.top(Infinity);
        
    // find the min
    results[competency].min = min = records[competent_heroes.length-1][competency]; // 0.06
    
    // find the max
    results[competency].max = max = records[0][competency]; // 1.12

    // how wide is each bin?
    bin_width = (max - min) / intervals;
      
    // What are the intervals of each bin?
    bins = [];
    for(var i = 0; i < intervals; i++) {
      bins.push(min + bin_width * (i + 1));
    }
    
    results[competency].bins = bins;
    // bin results by the quadrant they are in
    var whichGroup = function(val){
      for(var i = 0; i < intervals; i++) {
        if (i < intervals-1 && val < bins[i]) {
          return bins[i];
        } else if (i === intervals-1 && val <= bins[i]) {
          return bins[i];
        }
      }
    };
    
    var competency_grouping = dim.group(function(competency) {
      return whichGroup(competency); 
    }),

    // get all groups we just created
    competency_groups = competency_grouping.all();

    // The key will be the grouping function result, the value
    // by default will be count. we can always return something else.
    results[competency].scores = [];
    for (i = 0; i < intervals; i++) {
      var val = competency_groups[i].value;
      if (val < global_min) {
        global_min = val;
      }
      if (val > global_max) {
        global_max = val;
      }
      results[competency].scores.push(val);
    }  
  });
  
  // now let's see them!
  var container = $('#sparklines');
  _.each(competencies, function(competency) {
    var template = _.template($('#sparkline_template').text()),
      el = $(template({
        competency : competency,
        min : results[competency].min,
        max : results[competency].max
      }));
    container.append(el);
    var sparkline = $(el).find(".sparkline");

    sparkline.sparkline(results[competency].scores, {
      type : 'bar',
      fillColor : "blue",
      chartRangeMin : global_min,
      chartRangeMax : global_max,
      barWidth : sparkline.width()/intervals,
      height : 70
    });
  });
  
});