/* global __dirname */
/*

  1. в директиву entry добавляем файлы JS и SCSS, которые должны генерироваться в выходном бандле
  2. дублируем входные точки по два раз, добавляя в название дублирующей точки постфикс ".min"
  Тогда для обычный точек без ".min" будут сгенерированы не минимизированные файлы, а с ".min" - минимизированные
  Шаблоны названий входных точек, которые будут минимизироваться,
  задаются при конфигурации минимизаторов TerserPlugin и CssMinimizerPlugin
  3. Зависимости, которые должны копироваться в выходую директорию как есть задаются в CopyPlugin
  4. В MiniCssExtractPlugin задаются имена выходных файлов CSS.
  Если общий файл SCSS будет разбиваться на отдельные, нужно изменить директиву filename в MiniCssExtractPlugin
  5. Обрабатывается множество файлов PUG за счет генерации множества правил для HtmlWebpackPlugin с помощью PAGES.map
  6. В HtmlWebpackPlugin директива chunks указывает список выборочно инжектируемых зависимостей JS и CSS.
  Используется чтобы не инжектились одновременно минимизированные и нет версии файлов JS и CSS.
  Для большего контроля можно установить HtmlWebpackSkipAssetsPlugin,
  что позволить использовать шаблоны для фильтрации инжектируемых HtmlWebpackPlugin зависимостей
  7. В директиве описано выделение в отдельный файл общего кода из входных JS-файлов

*/

const fs = require('fs');
const path = require('path');
// извлекает код CSS и SCSS в отдельные файлы в итоговой сборке
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// минимизация SCSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// минимизация JS
const TerserPlugin = require('terser-webpack-plugin');
// применяется для генерации html файлов на основе шаблонов
const HtmlWebpackPlugin = require('html-webpack-plugin');
// для исключения по шаблону определенных точек входа в entry из списка инжектируемых html-webpack-plugin зависимостей
// const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin').HtmlWebpackSkipAssetsPlugin;

// для копирования отдельных файлов, которые не обрабатываются loader-ами
const CopyPlugin = require('copy-webpack-plugin');

// содержит все пути нашей сборки
const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
  assets: 'assets/'
};

// Собирает все файлы PUG для их обработки в HtmlWebpackPlugin
const PAGES_DIR = `${PATHS.src}/pug/pages`; // базовая директория для импорта файлов PUG
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.pug'));


// argv - используется для передачи параметров компиляции. Например флага production или development
module.exports = (_, argv) => (
  {
    // для доступа к переменным папок из других файлов конфигурации
    externals: {
      paths: PATHS
    },

    // без этой опции не работает Live-reload в текущей версии Webpack
    // target: 'web',

    // точки входа
    entry: {
      // app: {import: `${PATHS.src}/index.js`, filename: `${PATHS.assets}js/[name].js`},
      // style: {import: `${PATHS.src}/scss/main.scss`, filename: `${PATHS.assets}css/[name].css`},
      // точки входа повторяются два раза для одих и тех же файлов
      // чтобы в итоговой сборке были сгенерированы минимизированные и нет файлы
      // точки входа с суфиксом .min минимизируются отдельными плагинами, без этого суфикса - не минимизируются
      'app': [`${PATHS.src}/index.js`, `${PATHS.src}/scss/main.scss`],
      'app.min': [`${PATHS.src}/index.js`, `${PATHS.src}/scss/main.scss`],
      // файлы JS, которые должны генерироваться отдельно от общего файла
      'checkSupport': `${PATHS.src}/static/js/checkSupport.js`,
      'checkSupport.min': `${PATHS.src}/static/js/checkSupport.js`,
    },

    // [name] - файл будет называться как точки входа в enrty {}
    // [contenthash] - при каждой пересборке проекта добавляется хэш для защиты от кеширования браузерами
    // publickPath - по умолчанию после сборки ресурсы ищутся по следующему пути ${publicPath}/${prefix}/${assetName}
    // добавление publicPath: './' позволяет сформировать в html файла относительный путь к ресурсам после сборки
    output: {
      clean: true,
      filename: `${PATHS.assets}js/[name].js`,
      path: PATHS.dist,
      publicPath: './'
    },

    module: {
      rules: [
        {
          // JS
          // exclude - папки, которые не проходят через loader-ы, т.е в нашем случае не транспилируются Babel
          test: /\.js$/i,
          exclude: /(node_modules|bower_components)/,
          use: [
            'babel-loader'
          ]
        },

        {
          // PUG
          // используется pug-html-loader вместо pug-loader
          // для того, чтобы webpack брал в сборку картинки из PUG-файла
          // без необходимости писать их в формате require()
          test: /\.pug$/i,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: false,
                sources: {
                  list: [
                    '...',
                    {
                      tag: 'link', // не обрабатывать ресурсы в фавиконках, шрифтах, стилях
                      attribute: 'href',
                      type: 'src',
                      filter: () => false,
                    },
                    {
                      tag: 'script', // не обрабатывать ресурсы скриптов
                      attribute: 'src',
                      type: 'src',
                      filter: () => false,
                    },
                    {
                      tag: 'meta', // не обрабатывать ресурсы в метатегах
                      attribute: 'content',
                      type: 'src',
                      filter: () => false,
                    },
                    {
                      tag: 'use', // не обрабатывать ресурсы в тегах svg-спрайта
                      attribute: 'xlink:href',
                      type: 'src',
                      filter: () => false,
                    },
                  ],
                }
              }
            },
            {
              loader: 'pug-html-loader',
              options: {
                pretty: true
              }
            },
          ]
        },

        {
          // SCSS
          // resolve-url-loader - используется для исправления путей в папке dist,
          // благодаря ему в исходниках адреса к картинкам можно писать как есть в папке src,
          // далее лоадер поправит как должно быть в dist
          // publicPath: '../../' - добавляется в начало пути к assets в файлах CSS.
          // такой publicPath учитывает итоговое размещение assets относительно css в папке dist
          test: /\.scss$/i,
          use: [
            argv.mode === 'development' ? 'style-loader' :
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../../',
                  esModule: false
                }
              },
            {
              loader: 'css-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    // стили минимизируются отдельным плагином
                    'autoprefixer'
                  ],
                },
              }
            },
            {
              loader: 'resolve-url-loader',
              options: {sourceMap: true}
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  // стили минимизируются отдельным плагином
                  outputStyle: 'expanded'
                }
              }
            }
          ]
        },

        {
          // Images
          // [ext] - сохранит расширение файлов
          test: /\.(gif|png|jpe?g|webp|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: (pathData) => {
              // сохраняем файлы в те же подпапки, в которых они хранятся в исходниках src/assets/img
              const base = pathData.filename.split('img')[1];
              const slashIndex = base.lastIndexOf('/');
              const folder = base.slice(0, slashIndex);
              if (folder) {
                return `${PATHS.assets}img${folder}/[name][ext]`;
              }
              return `${PATHS.assets}img/[name][ext]`;
            },
            // filename: `${PATHS.assets}img/[name][ext]`
          }
        },

        {
          // Fonts
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: `${PATHS.assets}fonts/[name][ext]`
          }
        },
      ]
    },

    plugins: [
      // выделяет в отдельные файлы код CSS (а не добавляет в тело HTML как style-loader)
      new MiniCssExtractPlugin({
        // специально для того, чтобы общий выходной файл стилей имел название style.css,
        // а не app.css, как в директиве entry
        // если предполагается разбивка общего стилевого файла на отдельные для каждой страницы
        // нужно заменить на filename: `${PATHS.assets}css/[name].css`
        // тогда для каждой точки entry будет сгенерирован отдельный файл css
        filename: (pathData) => (pathData.chunk.name.includes('.min') ?
          `${PATHS.assets}css/style.min.css` :
          `${PATHS.assets}css/style.css`)
      }),
      // копирование файлов которые не обрабатываются file-loader в файлах HTML, CSS
      // или всех assets в файлах JS
      new CopyPlugin({
        patterns: [
          {from: `${PATHS.src}/assets/favicons`, to: `${PATHS.assets}/favicons`},
          // при копировании файлы сохраняются в папки, в которых они лежали в src/static
          {from: `${PATHS.src}/static`, to: `${PATHS.assets}/[path][name][ext]`},
        ]
      }),
      // берет файл из шаблона template и инжектит в него зависимости JS и CSS
      // использована обработка всех файлов PUG из директории исходников
      ...PAGES.map((page) =>
        new HtmlWebpackPlugin({
          minify: false,
          inject: true,
          // автоматически инжектим только определенные точки входа из entry
          chunks: ['app.min'],
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, '.html')}`
        })
      ),
    ],

    // в отдельные файлы 'vendors; выделяются все маломеняющиеся зависимости сторонних библиотек (вендров),
    // которые в выходной директории сохраняются как отдельный файлы vendor.js, vendor.css
    optimization: {
      minimize: true,
      minimizer: [
        // отдельный минимизатор для того, чтобы можно было генерировать минимизированный и нет файл JS
        // минимизированный генерируется только для точек entry в названии которых содерится .min
        new TerserPlugin({
          test: [/\.min\.js$/i],
          // не извлекать комментарии о лицензировании в экспортируемых модулях библиотек в отдельный файл
          extractComments: false,
          // в минифицированных файлах удалять все комментарии
          terserOptions: {
            format: {
              comments: false,
            },
          },
          // test: /\.min\.js$/i,
        }),
        // минимизация CSS
        // регулярное выражение с .min используется для того, чтобы была генерация сжатого и несжатого файла
        // сжатые будут генерироваться только если в директиве entry название бандла содерижт .min
        new CssMinimizerPlugin({
          test: /\.min\.css$/i,
        }),
      ],
      // splitChunks: {
      //   cacheGroups: {
      //     vendor: {
      //       name: 'vendors.min',
      //       test: /[\\/]node_modules[\\/]/,
      //       chunks: 'all'
      //     }
      //   }
      // }
    },
  });

