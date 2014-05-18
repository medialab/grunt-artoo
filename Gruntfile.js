module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        '-W055': true,
        '-W040': true,
        '-W064': true,
        '-W061': true,
        '-W107': true
      }
    },

    // Configuration to be run (and then tested).
    artoo: {
      dev: {
        options: {
          url: '//localhost:8000/build/artoo.concat.js',
          random: true
        }
      },
      prod: {
        options: {},
        src: './test/resources/dummy-script.js'
      },
      multi: {
        options: {},
        src: [
          './test/resources/dummy-script1.js',
          './test/resources/dummy-script2.js'
        ]
      }
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['artoo']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'artoo']);
};
