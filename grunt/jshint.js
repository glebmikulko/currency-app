module.exports = {
    options: {
        reporter: require('jshint-stylish')
    },

    main: [
        'www/js/services/*.js',
        'www/js/controllers/*.js',
        'www/js/app.js'
    ]
};
