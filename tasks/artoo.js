/*
 * grunt-artoo task
 *
 * This task is supposed to create an ad-hoc artoo bookmarklet
 */
var uglify = require('uglify-js'),
    cp = require('copy-paste').noConflict();

// Templates
var bookmarklet =
[";(function(undefined) {",

  "// Creating script",
  "var body = document.getElementsByTagName('body')[0],",
  "    script = document.createElement('script');",

  "// Setting correct attributes",
  "script.src = '//raw.githubusercontent.com/medialab/artoo/master/build/artoo.min.js';",
  "script.type = 'text/javascript';",
  "script.id = 'artoo_injected_script';",
  "script.setAttribute('settings', JSON.stringify('<%= settings %>'));",

  "// Appending to body",
  "body.appendChild(script);",
"})();"].join('\n');

module.exports = function(grunt) {

  // artoo's grunt multitask
  function multitask() {
  
    // Default options
    var options = this.options({
      url: 'https://raw.githubusercontent.com/' +
           'medialab/artoo/master/build/artoo.min.js',
      dest: './artoo-bookmarklet.min.js',
      files: null,
      script: null,
      eval: null,
      gist: null,
      settings: {}
    });

    // Rendering the bookmarklet template
    var rendered = grunt.template.process(
      bookmarklet,
      {
        data: {
          settings: JSON.stringify(options.settings)
        }
      }
    );

    // Minifying the template
    var minified = uglify.minify(rendered, {fromString: true}).code;

    // // Iterate over all specified file groups.
    // this.files.forEach(function(f) {
    //   // Concat specified files.
    //   var src = f.src.filter(function(filepath) {
    //     // Warn on and remove invalid source files (if nonull was set).
    //     if (!grunt.file.exists(filepath)) {
    //       grunt.log.warn('Source file "' + filepath + '" not found.');
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function(filepath) {
    //     // Read file source.
    //     return grunt.file.read(filepath);
    //   }).join(grunt.util.normalizelf(options.separator));

    //   // Handle options.
    //   src += options.punctuation;

    //   // Write the destination file.
    //   grunt.file.write(f.dest, src);

    //   // Print a success message.
    //   grunt.log.writeln('File "' + f.dest + '" created.');
    // });
  }

  // Registering the task
  grunt.registerMultiTask(
    'artoo',
    'A grunt task to create artoo bookmarklets.',
    multitask
  );
};
