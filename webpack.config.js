const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

const DEFAULT_FILE = 'README.md';

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  let file = env.file || DEFAULT_FILE;

  if (!file.endsWith('.md') && !file.endsWith('.markdown')) {
    file += '.md';
  }

  const filename = path.basename(file);
  const resolvedFile = path.resolve(__dirname, file);
  const resolvedDir = path.dirname(resolvedFile);

  return {
    mode: isProd ? 'production' : 'development',
    devtool: false,
    stats: {
      preset: 'minimal',
    },

    resolve: {
      alias: {
        // github url to a repository
        //'docs': 'https://github.com/webdiscus/ansis/raw/master/docs',

        '@styles': path.join(__dirname, 'src/styles'),
        '@scripts': path.join(__dirname, 'src/scripts'),
        '@images': path.join(__dirname, 'src/images'),
        '@npm': path.join(__dirname, 'node_modules'), // node_modules in local dir
      },
    },

    output: {
      path: path.join(__dirname, 'docs'),
      publicPath: 'auto',
    },

    plugins: [
      // use the pug-plugin to compile pug files defined in entry
      new HtmlBundlerPlugin({
        entry: [
          {
            import: 'src/index.hbs',
            filename: 'index.html',
            data: {
              markdownFile: resolvedFile,
              filePath: file,
              title: filename,
              markdownTheme: 'light',
              highlightingTheme: 'prism',
            },
          },
          {
            import: 'src/index.hbs',
            filename: 'index-dark.html',
            data: {
              markdownFile: resolvedFile,
              filePath: file,
              title: filename,
              markdownTheme: 'dark',
              highlightingTheme: 'prism-dark',
            },
          },
        ],
        js: {
          filename: 'js/[name].[contenthash:8].js',
        },
        css: {
          filename: 'css/[name].[contenthash:8].css',
        },

        hotUpdate: true,

        preprocessor: 'handlebars',

        // resolve relative files (e.g. images) defined in *.md file
        loaderOptions: {
          root: path.resolve(__dirname, 'src'),
          context: resolvedDir, // use it for html-bundler-webpack-plugin only, disable for others
        },

        watchFiles: {
          // add external path to watch includes
          paths: [resolvedDir],
          includes: [
            ///\.md/, // watch changes of *.md files in the paths
            file, // add external *.md file to watching
          ],
          excludes: [
            // exclude all files (defined as default extensions) except the exactly the file
            new RegExp(`${resolvedDir}/(?!${filename})`)
          ],
        },

        verbose: false,
      }),
    ],

    module: {
      rules: [
        {
          test: /\.(s?css)$/,
          use: ['css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        }
      ],
    },

    devServer: {
      // open in default browser
      open: true,

      static: {
        // important: this is the directory of an Markdown file to display images with relative url
        directory: path.dirname(resolvedFile),
      },

      watchFiles: {
        // watch only one file passed from the commandline
        paths: [resolvedFile, 'src/**/*.*'],
        options: {
          usePolling: true,
        },
      },

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
    },
  };
};
