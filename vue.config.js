const webpack = require('webpack');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: [
        'youtube-dl',
        'ytdl-core'
      ]
    },
    cordovaPath: 'src-cordova'
  },

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      })
    ]
  },

  publicPath: ''
}
