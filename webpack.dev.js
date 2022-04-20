const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.common.js');

module.exports = (env, argv) => {
  argv.mode = 'development';
  const config = baseWebpackConfig(env, argv);

  return merge(config, {
    mode: argv.mode,
    // тип геренируемого файла маппинга на исходники
    devtool: 'inline-source-map',

    devServer: {
      // перезагрузка сервера при изменении PUG файлов
      watchFiles: [`${config.externals.paths.src}/pug/**/*.pug`],
      port: 3000,
      devMiddleware: {
        publicPath: '/',
      },
      static: {
        directory: config.externals.paths.dist,
      },
      hot: true,
    },

    optimization: {
      runtimeChunk: {
        name: 'single',
      },
    },

    plugins: [
      // горячая загрузка CSS без перезагрузки всей страницы
      // new webpack.HotModuleReplacementPlugin(),
    ],
  });
};

/*
  before(_, server) {
        chokidar.watch([
          `${config.externals.paths.src}/pug/**\/*.pug`
        ]).on('all', function () {
          server.sockWrite(server.sockets, 'content-changed');
        });
      },
*/
