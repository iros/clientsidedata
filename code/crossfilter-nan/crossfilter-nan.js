var data = crossfilter([
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: NaN, tip: 100, type: "tab"},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"}
]);

// make a dimension for the total variable
var total_dimension = data.dimension(function(d) { return d.total; }),
  
  // find al records that have 90 as the value
  na_records = total_dimension.filter(90).top(Infinity),

  // random output ul
  elRecords = $('ul#records'); 

// output resulting filter values.  
elRecords.empty();
for (var i = 0; i < na_records.length; i++) {
    $('<li>', { text : na_records[i].total}).appendTo(elRecords);   
}
