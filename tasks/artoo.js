/*
 * grunt-artoo task
 *
 * This task is supposed to create an ad-hoc artoo bookmarklet
 */
var uglify = require('uglify-js'),
    cp = require('copy-paste').noConflict(),
    defaultOptions = require('../config.json');

// Shorteners
function minify(string) {
  return uglify.minify(string, {fromString: true}).code;
}

module.exports = function(grunt) {

  // Templates
  var template = grunt.file.read(__dirname + '/../templates/bookmarklet.tpl');

  // artoo's grunt multitask
  function multitask() {

    // Default options
    var options = this.options(defaultOptions),
        bookmark;

    // Default destination
    var dest = (this.files[0] && this.files[0].dest) ||
      'artoo.' + this.target + '.bookmarklet.min.js';

    // If user specified files, we need to concat/uglify them to be
    // evaluated by artoo on initialization.
    if (this.files[0] && this.files[0].src) {

      // Concatenation while filtering for inexistant files.
      var s = this.files[0].src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Souce file "' + filepath + '" not found.');
          return false;
        }
        else {
          return true;
        }
      }).map(function(filepath) {

        // Reading file
        return grunt.file.read(filepath);
      }).join('\n');

      // Minifying the scripts
      s = minify(s);

      // Assigning to settings
      options.settings.eval = JSON.stringify(s);
    }


    // Rendering the bookmarklet template
    bookmark = grunt.template.process(
      template,
      {
        data: {
          settings: JSON.stringify(options.settings),
          url: options.url,
          random: options.random ?
            "var r = Math.random();" +
            "script.src += '?r=' + r;" :
            ""
        }
      }
    );

    // Minifying the template
    bookmark = minify(bookmark);

    // Adding javascript prefix to be run as URL
    bookmark = 'javascript: ' + bookmark;

    // If clipboard, we copy the bookmark
    if (options.clipboard) {
      cp.copy(bookmark);
      grunt.log.ok(this.target + ' bookmarklet has been copied ' +
                     'to the clipboard');
    }

    // Writing to file
    grunt.file.write(dest, bookmark);
    grunt.log.ok(this.target + ' bookmarklet has been written to ' + dest);
  }

  // Registering the task
  grunt.registerMultiTask(
    'artoo',
    'A grunt task to create artoo bookmarklets.',
    multitask
  );
};
