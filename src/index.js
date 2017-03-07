import 'babel-polyfill'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { timeParse } from 'd3-time-format'
import { min, max, sum } from 'd3-array'
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3-scale'

import { responsivefy } from './components/responsivefy'
import { drawMultipleLineChart } from './components/lineChart'
import { drawMultipleAreaChart } from './components/areaChart'
import { drawStackedAreaChart } from './components/stackedAreaChart'
import { drawStreamGraphChart } from './components/streamGraphChart'
import { drawOverlappingAreaChart } from './components/overlappingAreaChart'

import './styles.css'

const parseStringToFloat = string =>
Math.round(parseFloat(string) * 100) / 100

const color = scaleOrdinal(schemeCategory10)

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 600 - margin.right - margin.left
const height = 400 - margin.top - margin.bottom

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

let stackedData = nest()
  .key(d => d.date)
  .entries(results)

stackedData = stackedData.map(item => {
  let values = {}
  item.values.map(d => ({ [d.symbol]: d.price }))
    .forEach(v => { Object.assign(values, v, { date: parseTime(item.key) }) })
  return values
})

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

data.sort((a, b) => a.maxPrice < b.maxPrice)

const xScale = scaleTime()
  .range([0, width - 50])
  .domain([
    min(data, co => min(co.values, d => d.date)),
    max(data, co => max(co.values, d => d.date))
  ])

const yScale = scaleLinear().range([height / 4 - 20, 0])

drawMultipleLineChart(svg, xScale, yScale, color, width, height, data)
window.setTimeout(() => {
  drawMultipleAreaChart(svg, xScale, yScale, color)
}, 2500)
window.setTimeout(() => {
  drawStackedAreaChart(svg, xScale, yScale, color, width, height, data, stackedData)
}, 3000)
window.setTimeout(() => {
  drawStreamGraphChart(svg, xScale, yScale, color, width, height, data, stackedData)
}, 4000)
window.setTimeout(() => {
  drawOverlappingAreaChart(svg, xScale, yScale, color, width, height, data)
}, 5000)
