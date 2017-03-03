import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import Dashboard from 'webpack-dashboard'
import DashboardPlugin from 'webpack-dashboard/plugin'

import config from './webpack.config.babel'

config.entry.app.unshift(
  'webpack/hot/dev-server',
  'webpack-dev-server/client?http://0.0.0.0:5000')

const compiler = webpack(config)

const dashboard = new Dashboard()
compiler.apply(new DashboardPlugin(dashboard.setData))

const server = new WebpackDevServer(compiler, {
  hot: true,
  quiet: true,
  noInfo: false
})

server.listen(5000)
