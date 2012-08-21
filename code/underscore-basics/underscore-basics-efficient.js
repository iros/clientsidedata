// fetch our hero json file...
$.get('../../data/all.json', function(heroes) {

  // === modify each record:
  // add a property called hasHeight to each object that marks whether it
  // has a height set or not
  var allHeights = 0, heightCount = 0;
  _.each(heroes, function(hero) {
    if (hero.Height_cm !== "NA" ||
        hero.Height_ft !== "NA") {

      // add up all heights and count how many we have
      allHeights += +hero.Height_cm;
      heightCount += 1;
    }
  });

  console.log("Mean height of all heroes", allHeights / heightCount);
  console.log("Heroes with length", heightCount);

});