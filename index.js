import { queue } from 'd3-queue'
import { select } from 'd3-selection'
import { csv } from 'd3-request/index'

import { responsivefy } from './components/responsivefy'
import { drawLineChart } from './components/lineChart'

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 960 - margin.right - margin.left
const height = 600 - margin.top - margin.bottom

const svg = select('.chart')
  .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy)

queue()
  .defer(csv, 'stocks.csv')
  .await((error, results) => {
    if (error) throw error
    drawLineChart(results)
  })
console.log('aaaaaaaa')
