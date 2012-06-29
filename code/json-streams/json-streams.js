// Based on fantastic work by @maxogden:
// http://substance.io/maxogden/replicating-large-datasets-into-html5
// * This is faking the actual chunking - replace the url with a proper
//   chunked file. Look for transfer-encoding: chunked in your headers.
// ==================================================================
// to build your own version of the browser bundle:
//     from a command line
//     npm install browserify -g
//     browserify -r events -r buffer -r stream -r util -r JSONStream -o browserify-bundle.js
// or download here: http://ireneros.com/LondonJS/browserify-bundle.js
// ==================================================================

// set up node library dependencies.
var stream = require('stream'),
    util = require('util'),
    JSONStream = require('JSONStream');


function XHRStream(xhr) {

    var self = this;

    // call stream constructor
    stream.Stream.apply(this, arguments);

    self.xhr = xhr;

    // will be used to track where each request ends
    // so that we can slice the right amount of data to pass to
    // the parser.
    self.offset = 0;

    // bind to state change to hook into readyState 3
    xhr.onreadystatechange = function() {
        self.handleReadyStateChange();
    };

    xhr.send(null);
}

// inherit from stream.Stream.
util.inherits(XHRStream, stream.Stream);

// handle ready state change (catches 3.)
XHRStream.prototype.handleReadyStateChange = function() {

    // intercept ready state 3 and emit the data to the json
    // stream parser.
    if (this.xhr.readyState === 3) {
        this.write();
    }

    // add an end state to catch the end of streaming.                
    if (this.xhr.readyState === 4) {
        this.emit('end');
    }
};

// On ready state change 3, pass the response text from this
// request to the json parser (by emitting it.)
XHRStream.prototype.write = function() {

    // as long as we actually have new data
    if (this.xhr.responseText.length > this.offset) {

        // removes already processed data from previous state changes.
        var data = this.xhr.responseText.slice(this.offset);

        // emits the current data chunk
        this.emit('data', data);

        // resets the offset to include current text.
        this.offset = this.xhr.responseText.length;
    }
};


// Create a new XHR Request and fetch a large json file.
var xhr = new XMLHttpRequest();
xhr.open("GET", "../../data/heroes.json", true);

// create a new XHRStream object
var xhrstream = new XHRStream(xhr);

// create a new json stream parser that will look for all the elements
// inside the root json element
var json = JSONStream.parse([/./]);

// setup json stream pipe from the xhr stream
xhrstream.pipe(json);

// on new incoming data, just output each hero's name
json.on('data', function(hero) {
    console.log(hero.name);
});

// on new incoming data, just output each hero's name
json.on('done', function() {
    console.log("Done");
});
