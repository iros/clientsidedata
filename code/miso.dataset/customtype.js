// all types live under the Miso.types namespace.
Miso.Dataset.types.moneyWithCommas = {

  // provide a name for your type.
  name : 'moneyWithCommas',

  // provide a method to test any incoming value for whether it
  // fits within the scope of this type.
  // return true if value is of this type. False otherwise.
  test : function(value) {
     return (/(^\d{1,3}([\,]?\d{3})*(\.\d{1,2})?$)/).test(value);
  },

  // provide a way to compare two values. This will be used by
  // the sorting algorithm, so be sure to return the correct values:
  // -1 if value1 < value2
  // 1 if value1 > value2
  // 0 if they are equal.
  compare : function(value1, value2) {
      if (value1 < value2) { return -1; }
      if (value1 > value2) { return 1; }
      return 0;
  },

  // how would this value be represented numerically? For example
  // the numeric value of a timestamp is its unix millisecond value.
  // This is used by the various computational functions of columns
  // (like min/max.)
  numeric : function(value) {
    return value;
  },

  // convert an incoming value into this specific type.
  // should return the value as would be represented by this type.
  coerce : function(value) {
    return +(value.replace(/,/g, ""));
  }
};


var sampleData = [
    { a : "45" },
    { a : "45,000" },    
    { a : "45,000.00" },    
    { a : "45000" }
];

var ds = new Miso.Dataset({
    data : sampleData,
    columns : [
        { name : "a", type : "moneyWithCommas" }
    ]        
});

ds.fetch().then(function() {
  console.log(ds.column("a").data);
});