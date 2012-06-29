// create a worker for heroes and villains. The workers
// don't actually care which is which, they just need a url
// to fetch some hero/villain objects from.
var hero_worker = new Worker("worker.js"),
    villain_worker = new Worker("worker.js");


// Callback that just renders the resulting avg height
// for the specific category and appends it to the div
// we have as a placeholder.
var handle_data = function(e) {
  if (e.data.status === "done") {
    $('<div>', {
      text : e.data.url + ": " + e.data.value
    }).appendTo($('#heroes'));  
  }
};

// Setup both workers to use the above handler as their
// on message handler.
hero_worker.onmessage = handle_data;
villain_worker.onmessage = handle_data;

// kick off both workers by passing them the urls
// to fetch
hero_worker.postMessage({ 
  cmd : "start", 
  url : '../../data/just_heroes.json' 
});

villain_worker.postMessage({ 
  cmd : "start", 
  url : '../../data/just_villains.json' 
});