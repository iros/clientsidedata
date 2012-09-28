// Instantiate a new Miso Dataset object and point it
// at our trusty hero database.
var heroes = new Miso.Dataset({
   url: '../../data/all.json'
});

// fetch data
heroes.fetch().then(function() {

  // Get all the hair color counts
  // and then sort them by the actual resulting count.
  var heroes_by_haircolor = heroes.countBy("Hair_color")
    .sort(function(row1, row2) {
      if (row1.count > row2.count) { return -1; }
      if (row1.count < row2.count) { return 1; }
      return 0;
    });

  // ==== output top 10 colors as a basic list.
  var list = $('ul#heroHairColor').empty();
  for(var i = 0; i < 10; i++) {
    var row = heroes_by_haircolor.rowByPosition(i);
    $('<li>', { 
      text : row.Hair_color + " (" + row.count + ")"
    })
    .appendTo(list);
  }
});