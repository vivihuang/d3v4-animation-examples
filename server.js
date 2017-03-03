import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import config from './webpack.config.babel'

config.entry.app.unshift(
  'webpack/hot/dev-server',
  'webpack-dev-server/client?http://0.0.0.0:5000')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  hot: true,
  quiet: true,
  noInfo: false
})

server.listen(5000)
console.log('Server is listening on port 5000~~~')