(function(){

  // Create a heroes data 'model' that binds to our json url.
  // Note that this model is actually going to contain a collection of
  // heroes... but that's a terminology inconsistancy.
  var Heroes = can.Model({
      // To fetch all models, define the findAll fetch method 'GET'
      // and the URL we are going against.
      findAll: 'GET ../../data/heroes.json'
  }, {});


  // Create a control for the Heroes.
  var HeroesControl = can.Control({
          // set up default template
          defaults: {
              view: 'heroesEJS'
          }
      }, 
      {
          // Init is auto called on instantiation            
          'init': function(element, options) {
              var self = this;

              // Fetch all heroes
              Heroes.findAll({}, function(heroes) {

                  // Render all heroes
                  self.element.html(can.view(self.options.view, {
                      heroes: heroes
                  }));
              });
          },

          // Random callback for clicking on elements for demo purposes.        
          'li click': function(li, event) {
              li.data("hero").attr('name', 'Monkey');
          }
      }
  );

  var heroesApp = new HeroesControl('#heroes');
}());