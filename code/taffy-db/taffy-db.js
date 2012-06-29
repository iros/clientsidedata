// fetch our hero json file...
$.get('../../data/heroes.json', function(heroes) {

  // create a database of heroes
  var heroes = TAFFY(heroes);

  // find all the male & female heroes
  var male_heroes = heroes({ 
    Gender : "male", 
    type : "hero", 
    Height_cm : { "!is" : "NA" }
  }),
  female_heroes = heroes({ 
    Gender : "female", 
    type : "hero",  
    Height_cm : { "!is" : "NA" } 
  }),
  unknown_gender_heroes = heroes({
    Gender : ({ "!is" : "male "}, {"!is" : "female"}),
    type : "hero",  
    Height_cm : { "!is" : "NA" } 
  });

  console.log("Number of heroes that are male: ", male_heroes.count());
  console.log("Number of heroes that are female: ", female_heroes.count());
  console.log("Number of heroes w/ unknown gender: ", unknown_gender_heroes.count());

  // compute their average heights
  var male_hero_all_heights = 0, female_hero_all_heights = 0,
      unknown_gender_heroes_all_heights = 0;

  male_heroes.each(function(hero) {
    male_hero_all_heights += +hero.Height_cm;
  });

  female_heroes.each(function(hero) {
    female_hero_all_heights += +hero.Height_cm;
  });

  unknown_gender_heroes.each(function(hero) {
    unknown_gender_heroes_all_heights += +hero.Height_cm;
  });

  console.log("Mean height of male heroes", male_hero_all_heights / male_heroes.count());
  console.log("Mean height of female heroes", female_hero_all_heights / female_heroes.count());
  console.log("Mean height of unknown gender heroes", unknown_gender_heroes_all_heights / unknown_gender_heroes.count());
});