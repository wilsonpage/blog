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
          'css/main.css': 'css/main.scss'
        }
      },
      dist2: {                            // Target
        options: {                       // Target options
          style: 'expanded',
          compass: true
        },
        files: {                         // Dictionary of files
          '_site/css/main.css': 'css/main.scss'
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
  grunt.loadNpmTasks('grunt-jekyll');


  grunt.registerTask('site', ['jekyll', 'sass:dist2']);
  grunt.registerTask('default', ['site']);

};