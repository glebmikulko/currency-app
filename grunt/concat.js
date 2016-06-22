module.exports = {
  concat: {
      dist: {
          src: [
              'www/js/controllers/*.js',
              'www/js/services/*.js',
              'www/js/app.js'
          ],
          dest: 'www/js/build/production.js',
      }
  }
};
