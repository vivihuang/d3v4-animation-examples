import 'babel-polyfill'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { timeParse } from 'd3-time-format'
import { min, max, sum } from 'd3-array'
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10, scaleBand } from 'd3-scale'
import { line, curveCatmullRom } from 'd3-shape'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

import { responsivefy } from './components/responsivefy'
import { drawMultipleLineChart } from './components/lineChart'
import { drawMultipleAreaChart } from './components/areaChart'
import { drawStackedAreaChart } from './components/stackedAreaChart'
import { drawStreamGraphChart } from './components/streamGraphChart'
import { drawOverlappingAreaChart } from './components/overlappingAreaChart'
import { drawGroupedBarChart } from './components/groupedBarChart'
import { drawStackedBarChart } from './components/stackedBarChart'
import { drawTransposeBarChart } from './components/transposeBarChart'

import './styles.css'

const parseStringToFloat = string =>
Math.round(parseFloat(string) * 100) / 100

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

const color = scaleOrdinal(schemeCategory10)

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 1000 - margin.right - margin.left
const height = 500 - margin.top - margin.bottom

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

let xScale = scaleTime()
  .range([0, width - 50])
  .domain([
    min(data, co => min(co.values, d => d.date)),
    max(data, co => max(co.values, d => d.date))
  ])

const yScale = scaleLinear().range([height, 0]).domain([0, 0])

const currentLine = line()
  .x(d => xScale(d.date))
  .y(height)
  .curve(curveCatmullRom.alpha(0.5))

const svg = select('.chart')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  // .call(responsivefy)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const symbols = svg.selectAll('.symbol')
  .data(data)
  .enter().append('g')
  .attr('class', 'symbol')
  .attr('transform', (d, i) => `translate(0, ${i * height / 4 + 10})`)

symbols.each(function (d) {
  const layer = select(this)

  layer.append('path')
    .attr('class', 'area')

  layer.append('path')
    .attr('class', 'line')

  layer.append('text')
    .text(d.key)
    .attr('class', 'legend')
})

svg.append('path')
  .attr('class', 'reference line')
  .attr('d', currentLine(data[0].values))
  .style('opacity', 0)

yScale.range([height / 4 - 20, 0])

const showReferenceLine = () => {
  svg.selectAll('.reference')
    .transition(easeTransition())
    .style('opacity', 1)
}

const hideReferenceLine = () => {
  svg.selectAll('.reference')
    .style('opacity', 0)
}

drawMultipleLineChart(symbols, xScale, yScale, color)
window.setTimeout(() => {
  drawMultipleAreaChart(symbols, xScale, yScale, color)
}, 2500)
window.setTimeout(() => {
  showReferenceLine()
  drawStackedAreaChart(symbols, xScale, yScale, height, data, stackedData)
}, 3000)
window.setTimeout(() => {
  hideReferenceLine()
  drawStreamGraphChart(symbols, xScale, yScale, color, height, data, stackedData)
}, 4000)
window.setTimeout(() => {
  showReferenceLine()
  drawOverlappingAreaChart(symbols, xScale, yScale, color, height, data)
}, 5000)
window.setTimeout(() => {
  symbols.selectAll('.line')
    .transition(easeTransition(0))
    .style('opacity', 0)
    .remove()
  symbols.selectAll('.area')
    .transition(easeTransition(0))
    .style('opacity', 0)
    .remove()
  xScale = scaleBand()
    .domain(data[0].values.map(d => d.date))
    .range([0, width - 50])
    .paddingInner(0.1)
  const x1Scale = scaleBand()
    .domain(data.map(d => d.key))
    .range([0, xScale.bandwidth()])
  yScale.range([height, 0]).domain([0, max(data, d => d.maxPrice)])
  drawGroupedBarChart(symbols, xScale, x1Scale, yScale, color, width, height)
}, 5500)
window.setTimeout(() => {
  xScale = scaleBand()
    .domain(data[0].values.map(d => d.date))
    .range([0, width - 50])
    .paddingInner(0.1)
  const x1Scale = scaleBand()
    .domain(data.map(d => d.key))
    .range([0, xScale.bandwidth()])
  drawStackedBarChart(symbols, xScale, x1Scale, yScale, width, height, data, stackedData)
}, 6000)
