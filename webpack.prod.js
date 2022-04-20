const webpack = require('webpack');
const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.common.js');
/*
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');
*/

module.exports = (env, argv) => {
  argv.mode = 'production';
  const config = baseWebpackConfig(env, argv);

  return merge(config, {
    mode: argv.mode,
    // CleanWebpackPlugin - по умолчанию очищает папку с итогами сборки
    // указанную в опции output:path конфигурационного файла webpack
    plugins: [
      // выводит в консоль прогресс сборки проекта
      new webpack.ProgressPlugin({
        activeModules: false,
        entries: true,
        handler(percentage, message) {
          // eslint-disable-next-line no-console
          console.info(`${Math.trunc(percentage * 100)}%`, message);
        },
        modules: true,
        modulesCount: 5000,
        profile: false,
        dependencies: true,
        dependenciesCount: 10000,
        percentBy: null,
      }),
      // минимизация картинок
      /*
      new ImageminPlugin({
        test: /\.(gif|png|jpe?g|webp|svg)$/i,
        disable: argv.mode === 'development',
        gifsicle: {
          optimizationLevel: 2,
          interlaced: true
        },
        optipng: null, // отключаем, вместо него будет использоваться pngquant
        pngquant: {
          quality: '65-80',
          speed: 4
        },
        jpegtran: null, // отключаем, вместо него будет использоваться Mozjpeg
        svgo: {
          plugins: [
            {removeUselessDefs: false}, // не удаляет symbol-теги в svg-спрайтах
            {removeHiddenElems: {displayNone: false}}, // не удаляет весь код с display: none в svg-спрайтах
            {cleanupIDs: {remove: false}}, // не удаляет symbol-теги в svg-спрайтах с неиспользуемым ID
            {removeViewBox: false}, // не удалят viewbox
            {removeDimensions: true} // заменяет width/height на viewBox
          ]
        },
        plugins: [
          imageminWebp({quality: 75}), // дополнительная оптимизация Webp
          imageminMozjpeg({progressive: true})
        ]
      }),
      */
    ],
  });
};
