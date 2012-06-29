// fetch our hero json file...
$.get('../../data/heroes.json', function(heroes) {

  // === modify each record:
  // add a property called hasHeight to each object that marks whether it
  // has a height set or not
  _.each(heroes, function(hero) {
    if (hero.Height_cm !== "NA" ||
        hero.Height_ft !== "NA") {
      hero.hasHeight = true;

      // convert to number from a string
      hero.Height_cm = +hero.Height_cm;
    
    } else {
      hero.hasHeight = false;
    }
  });

  // === find subset of original records
  // find all the heroes that have a height
  var heroes_with_height = _.filter(heroes, function(hero) {
    return hero.hasHeight;
  });

  // === get a new array based on existing collection
  // find all the heights
  var heights = _.pluck(heroes_with_height, "Height_cm");

  // === compute a single value
  // compute the mean height
  _.mixin({
    sum : function(obj, key) {
      var arr;
      key = key || 'value';
      if (_.isArray(obj) && typeof obj[0] === 'number') {
        arr = obj;
      } else {
        arr = _(obj).pluck(key);
      }
      var val = 0;
      for (var i=0, len = arr.length; i<len; i++) {
        val += arr[i];
      }
      return val;
    },

    mean : function(obj, key) {
      return _.sum(obj, key) / _(obj).size();
    }
  });

  console.log("Mean height of all heroes", _.mean(heights));
  console.log("Heroes with length", heroes_with_height);

});