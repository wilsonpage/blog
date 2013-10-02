module.exports = function(grunt) {

  grunt.initConfig({
    jekyll: {                             // Task
      options: {                          // Universal options
          src : '<%= app %>'
      },
      dist: {                             // Target
        options: {                        // Target options
          dest: '<%= dist %>',
          config: '_config.yml'
        }
      }
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded',
          compass: true
        },
        files: {                         // Dictionary of files
          'lib/css/main.css': 'lib/css/main.scss'
        }
      },
      dist2: {                            // Target
        options: {                       // Target options
          style: 'expanded',
          compass: true
        },
        files: {                         // Dictionary of files
          '_site/lib/css/main.css': 'lib/css/main.scss'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'lib/js',
          name: 'main',
          //mainConfigFile: 'lib/js/main.js',
          insertRequire: ['main'],
          out: '_site/lib/js/main.built.js',
          include: ["../../components/requirejs/require"]
        }
      }
    },

    watch: {
      jekyll: {
        files: [
          '_posts/*.markdown',
          '_includes/*.html',
          '_layouts/*.html',
          '*.html'
        ],
        tasks: ['site'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: '**/*.scss',
        tasks: ['sass:dist2'],
        options: {
          livereload: true,
        }
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jekyll');


  grunt.registerTask('site', ['sass:dist', 'jekyll']);
  grunt.registerTask('default', ['site']);

};