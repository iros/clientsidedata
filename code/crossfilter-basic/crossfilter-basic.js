// fetch our json file... this time with d3 just for fun.
d3.json("../../data/heroes.json", function(heroes) {

  // before we pass heroes out to crossfilter, remove those that don't
  // have an intelligence property.
  var heroes_with_intelligence = _.filter(heroes, function(hero) {
    return (typeof hero.intelligence !== "undefined" && 
           !_.isNaN(hero.intelligence));
  });

  // pass the data through the crossfilter
  var heroes_cf = crossfilter(heroes_with_intelligence);

  // === building dimensions
  // build an intelligence dimension
  var intelligence_dim = heroes_cf.dimension(function(hero) {
    return hero.intelligence;
  });

  // ==== basic filtering
  // find all records that are in the upper quadrant
  var lower_quad_intelligence_filter = intelligence_dim.filter([0, 0.25]),
      lower_quad_intelligence = lower_quad_intelligence_filter.top(Infinity);

  console.log("# Heroes with intelligence in the lower quadrant", 
              lower_quad_intelligence.length);

  // === grouping
  // clear filter
  intelligence_dim.filterAll();

  // find our min and max
  var records = intelligence_dim.top(Infinity),
    max = records[0].intelligence, // 0.06
    min = records[heroes_with_intelligence.length-1].intelligence, // 1.12
    bin_width = (max - min) / 4, 
    // bin stops
    bins = [min + bin_width, min + bin_width*2, min + bin_width*3, min + bin_width*4];
  
  
  // bin results by the quadrant they are in
  var intelligence_grouping = intelligence_dim.group(function(intelligence) {
    if (intelligence < bins[0]) {
      return bins[0];
    } else if (intelligence < bins[1]) {
      return bins[1];
    } else if (intelligence < bins[2]) {
      return  bins[2];
    } else if (intelligence <= bins[3]) {
      return  bins[3];
    } 
  }),

  // get all groups.
  intelligence_groups = intelligence_grouping.all();

  // The key will be the grouping function result, the value
  // by default will be count. we can always return something else.
  for (var i = 0; i < bins.length; i++) {
    console.log(intelligence_groups[i].key, 
                intelligence_groups[i].value);
  }

});