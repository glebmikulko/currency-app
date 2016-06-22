module.exports = {
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
};
