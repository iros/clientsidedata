(function() {
    // Define a base Hero Model
    var Hero = Backbone.Model.extend({}),
        
    // Define a collection of Heroes that will pull the hero data
    // and create a model for each available hero
        Heroes = Backbone.Collection.extend({
            model : Hero,
            url: '../../data/heroes.json'
        }),
        
    // Define a basic view for a hero model - just an li element
    // that will be appended to a list.
        HeroView = Backbone.View.extend({
            tagName : 'li',
            render : function() {
                this.$el.html(this.model.get('name'));
                return this;
            }            
        }),
        
    // Define a view for a list of heroes - it will create a hero view
    // for each hero and append it to an element, in this case a ul.
        HeroesView = Backbone.View.extend({
            tagName: 'ul',
            initialize : function() {
              this._views = [];  
            },
            render : function() {
                
                // clear current contents
                this.$el.empty();
                
                // create view for every hero in the collection
                this.collection.each(function(hero) {
                    var heroView = new HeroView({
                        model : hero
                    });
                    
                    this.$el.append(heroView.render().$el);
                    this._views.push(heroView);
                }, this);
            }            
        });


    // Now instantiate our heroes collection
    var allHeroes = new Heroes();

    // Fetch the hero collection
    allHeroes.fetch({
        success : function() {
            
            // on a successful fetch, create a view of
            // all the heroes
            var allHeroesView = new HeroesView({
                el : '#heroes',                
                collection : allHeroes
            });    
            
            // render the view we created.
            allHeroesView.render();
        }       
    });
}());