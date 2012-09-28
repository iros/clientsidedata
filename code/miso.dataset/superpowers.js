// Instantiate a new Miso Dataset object and point it
// at our trusty hero & villain database.
var all = new Miso.Dataset({
  url: '../../data/all.json'
});

// fetch data
all.fetch().then(function() {

  // first find all the super power columns... we have > 170 of them.
  var superPowers = _.filter(all.columnNames(), function(name) {
    return (/superpower/).test(name);
  });

  $('#howMany .count').html(superPowers.length);

  // Now, let's add a computed column for how many superpower each hero has
  all.addComputedColumn("sp_count", "number", function(row) {
    // iterate over all the super power columns per row and add them up.
    // Their values are either 1 or 0.
    return _.inject(superPowers, function(memo, power) {
      return memo + row[power];
    }, 0);
  });

  // now lets find the average, min and max.
  $('#perHero .count').html(all.mean("sp_count").toFixed());
  $('#perHero .min').html(all.min("sp_count"));
  $('#perHero .max').html(all.max("sp_count"));

  // now let's make a frequency table and plot a histogram
  // of the number of super powers heroes have on average
  var bins = [], 
      count = 10, 
      width = all.max("sp_count") / count, 
      bin;
  all.each(function(row) {
    bin = Math.floor(row.sp_count / width);
    bins[bin] = bins[bin] + 1 || 1;
  });
  // make sure all bins have values
  _.map(bins, function(val, i) {
    if (typeof val === "undefined") {
      bins[i] = 0;
    }
  });

  var sparkline = $('#perHero .sp'),
      template = _.template($('#sparkline_template').text()),
      el = $(template({
        min : all.min("sp_count"),
        max : all.max("sp_count")
      }));

  sparkline.append(el);
  el.find('.chart').makeSparkline(bins);

  // last but not least, what are the top 10 most common superpowers?
  // let's compute the total of each super hero column
  var superpowerCounts = [];
  var heroes = all.where(function(row) { 
      return row.type === "hero";
    }),
    villains = all.where(function(row) { 
      return row.type === "villain";
    });
  
  _.each(superPowers, function(power, i) {
    superpowerCounts[i] = { 
      power : power, 
      count : all.sum(power), 
      hero : (100*(heroes.sum(power) / heroes.length)).toPrecision(2), 
      villain : (100*(villains.sum(power) / villains.length)).toPrecision(2)
    };
  });
  
  superpowerCounts = _.sortBy(superpowerCounts, function(power) {
    return -power.count;
  });

  var topList = $('#allSuperpowers .topList'), 
      bottomList = $('#allSuperpowers .bottomList'),
      liTemplate = _.template($('#superpowerStat').html());

  // top 10
  for (var i = 0; i < 10; i++) {
    el = $(liTemplate({ 
      s : superpowerCounts[i] 
    })).appendTo(topList);
    el.makePie('.hsparkline', superpowerCounts[i], 'hero');
    el.makePie('.vsparkline', superpowerCounts[i], 'villain');
  }
  // bottom 10
  for (i = 0; i < 10; i++) {
    var idx = superPowers.length-1-i;
    el = $(liTemplate({ 
      s : superpowerCounts[idx] 
    })).appendTo(bottomList);
    el.makePie('.hsparkline', superpowerCounts[idx], 'hero');
    el.makePie('.vsparkline', superpowerCounts[idx], 'villain');
  }


});