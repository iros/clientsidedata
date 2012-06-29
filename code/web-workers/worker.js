// we are going to use underscore here.
importScripts("http://underscorejs.org/underscore-min.js");

// attach an on message handler. This is how we actually kick off
// this worker, by sending it a start message. It also expects
// a url to retrieve.
onmessage = function(e){

  // if worker was kicked off
  if (e.data.cmd === "start") {
    
    // an xhr ready state 
    var handleHeroes = function() {

      if(this.readyState == this.DONE && this.status == 200) {

        // parse incoming text back into json
        var heroes = JSON.parse(this.responseText);
        
        // sum up the height and count numer of heights we have
        // since not all heroes/villains have heights set.
        var allHeights = 0, heightCount = 0;
        _.each(heroes, function(hero) {
          if (hero.Height_cm !== "NA" ||
              hero.Height_ft !== "NA") {

            // add up all heights and count how many we have
            allHeights += +hero.Height_cm;
            heightCount += 1;
          }
        });

        // indicate we are done and pass back the avg height as well
        // as the url.
        done({ url : e.data.url, val : allHeights / heightCount });
      }
    };

    // kick off an XHR request to fetch the heroes/villains.
    var client = new XMLHttpRequest();
    client.onreadystatechange = handleHeroes;
    client.open("GET", e.data.url);
    client.send();
  }
};

// when we are done with the worker, post back the result.
function done(res){
  postMessage({ status : "done", value : res.val, url : res.url });
}