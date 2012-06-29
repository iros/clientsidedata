/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    lint: {
      files: ['grunt.js', 'code/**/*.js']
    },
    
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        $ : true,
        _ : true,
        Miso : true,
        TAFFY : true,
        crossfilter : true,
        console : true,
        onmessage : true,
        postMessage : true,
        importScripts : true,
        require : true,
        d3 : true,
        can : true,
        Backbone : true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');

};
