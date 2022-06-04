const path = require('path');
const PugPlugin = require('pug-plugin');

const DEFAULT_FILE = 'README.md';

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  let file = env.file || DEFAULT_FILE;

  if (!file.endsWith('.md')) {
    file += '.md';
  }

  const resolvedFile = path.resolve(__dirname, file);

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',
    stats: {
      preset: 'minimal',
    },

    resolve: {
      alias: {
        ALIAS_TO_FILE: resolvedFile,
        docs: path.resolve(__dirname, 'src'),
      },
    },

    output: {
      path: path.join(__dirname, 'docs'),
      // using `npm run docs` generates documentation from README.md in `docs` folder
      // all assets from `docs` folder must have the publicPath `/github-readme-preview/`
      publicPath: isProd ? '/github-readme-preview/' : '/',
      // output filename of scripts
      filename: 'assets/js/[name].[contenthash:8].js',
    },

    entry: {
      // pass the file into Pug template
      index: 'src/index.pug?file=' + file,
    },

    plugins: [
      // use the pug-plugin to compile pug files defined in entry
      new PugPlugin({
        //verbose: true, // output information about the process to console
        modules: [
          // the `extractCss` module extracts CSS from source style files
          // you can require source style files directly in Pug
          PugPlugin.extractCss({
            // output filename of styles
            filename: 'assets/css/[name].[contenthash:8].css',
          })
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader, // the pug-loader is already included in PugPlugin
          options: {
            method: 'render', // fast method to compile Pug files in static HTML
            // enable filters only those used in pug
            embedFilters: {
              // :escape
              escape: true,
              // :code
              code: {
                className: 'language-',
              },
              // :highlight
              highlight: {
                verbose: true,
                use: 'prismjs', // name of highlighting npm package, must be installed
              },
              // :markdown
              markdown: {
                highlight: {
                  verbose: true,
                  use: 'prismjs', // name of highlighting npm package, must be installed
                },
              },
            },
          },
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name].[ext]',
          },
        }
      ],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      https: false,
      compress: true,

      watchFiles: {
        // watch only one file passed from commandline
        paths: [resolvedFile],
        options: {
          usePolling: true,
        },
      },

      // open in default browser
      //open: true,
    },
  };
};