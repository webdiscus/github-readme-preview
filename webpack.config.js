const path = require('path');
const PugPlugin = require('pug-plugin');
//const PugPlugin = require('../../GitHub/webpack/pug-plugin'); // for local development only

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
        Docs: path.resolve(__dirname, 'src'),
        Styles: path.join(__dirname, 'src/assets/styles'),
        Scripts: path.join(__dirname, 'src/assets/scripts'),
        Images: path.join(__dirname, 'src/assets/images'),
      },
    },

    output: {
      path: path.join(__dirname, 'docs'),
      publicPath: 'auto',
    },

    entry: {
      // pass the file into Pug template
      index: path.join(__dirname, 'src/index.pug?file=') + file,
    },

    plugins: [
      // use the pug-plugin to compile pug files defined in entry
      new PugPlugin({
        js: {
          // output filename of scripts
          filename: 'assets/js/[name].[contenthash:8].js',
        },
        css: {
          // output filename of styles
          filename: 'assets/css/[name].[contenthash:8].css',
        },
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
                github: true, // support github syntax for note, warning
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
        // important: this is the directory of an MD file to display images with relative url
        directory: path.dirname(resolvedFile),
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
      open: true,
    },
  };
};
