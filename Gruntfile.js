module.exports = function(grunt) {

    // 1. Вся настройка находится здесь
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'www/js/controllers/*.js',
                    'www/js/services/*.js',
                    'www/js/app.js'
                ],
                dest: 'www/js/build/production.js',
            }
        },

        uglify: {
            build: {
                src: 'www/js/build/production.js',
                dest: 'www/js/build/production.min.js'
            }
        },

        imagemin: {
          dynamic: {
              files: [{
                  expand: true,
                  src: [
                    'www/img/*.{png,jpg,gif}',
                    'www/img/cur_icons/*.{png,jpg,gif}'
                  ],
                  dest: 'www/img/build/'
              }]
          }
      }
    });

    // 3. Тут мы указываем Grunt, что хотим использовать этот плагин
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);

};
