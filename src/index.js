import 'babel-polyfill'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { timeParse } from 'd3-time-format'
import { min, max, sum } from 'd3-array'
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3-scale'
import { axisBottom } from 'd3-axis'

// import { responsivefy } from './components/responsivefy'
import { drawMultipleLineChart } from './components/lineChart'
import { drawMultipleAreaChart } from './components/areaChart'

import './styles.css'

const parseStringToFloat = string =>
Math.round(parseFloat(string) * 100) / 100

const color = scaleOrdinal(schemeCategory10)

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 400 - margin.right - margin.left
const height = 300 - margin.top - margin.bottom

const svg = select('.chart')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  // .call(responsivefy)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const results = require('./stocks.csv')

const parseTime = timeParse('%b %Y')
let data = nest()
  .key(d => d.symbol)
  .entries(results)

data.map(d => Object.assign(d, {
  values: d.values.map(v => ({
    date: parseTime(v.date),
    price: parseStringToFloat(v.price)
  }))
}))

data.map(d => Object.assign(d, {
  maxPrice: max(d.values, v => v.price),
  sumPrice: sum(d.values, v => v.price),
}))

data.sort((a, b) => b.maxPrice - a.maxPrice)

const xScale = scaleTime()
  .range([0, width - 50])
  .domain([
    min(data, co => min(co.values, d => d.date)),
    max(data, co => max(co.values, d => d.date))
  ])

const yScale = scaleLinear().range([height / 4 - 20, 0])

svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .attr('class', 'axis x')
  .call(axisBottom(xScale).ticks(5))

drawMultipleLineChart(svg, xScale, yScale, color, width, height, data)
drawMultipleAreaChart(symbols, xScale, yScale, color)
