module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      dist: {
        files: {
          'css/style.css' : 'css/style.less'
        }
      }
    },
    autoprefixer: {
      options: {
        map: true
      },
      dist:{
        files:{
          'css/style.css' : 'css/style.css'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.less',
        tasks: ['less','autoprefixer']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
}
