module.exports = {
    // Опции
    options: {
        limit: 3
    },

    // Задачи разработки
    devFirst: [
        'jshint'
    ],
    devSecond: [
        'concat',
        'uglify'
    ],

    // Производственные задачи
    prodFirst: [
        'jshint'
    ],
    prodSecond: [
        'concat',
        'uglify'
    ],

    // Задачи изображений
    imgFirst: [
        'imagemin'
    ]
};
