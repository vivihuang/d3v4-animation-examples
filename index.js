import { queue } from 'd3-queue'
import { select } from 'd3-selection'
import { csv } from 'd3-request/index'
import { nest } from 'd3-collection'
import { timeParse } from 'd3-time-format'
import { min, max, sum } from 'd3-array'
import { scaleTime, scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'

import { responsivefy } from './components/responsivefy'
import { drawMultipleLineChart } from './components/lineChart'

const parseStringToFloat = string =>
  Math.round(parseFloat(string) * 100) / 100

const color = scaleOrdinal()
  .range(['#c6dbef', '#9ecae1', '#6baed6']);

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 480 - margin.right - margin.left
const height = 300 - margin.top - margin.bottom

const svg = select('.chart')
  .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    // .call(responsivefy)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

queue()
  .defer(csv, 'stocks.csv')
  .await((error, results) => {
    if (error) throw error
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
      .range([0, width - 10])
      .domain([
        min(data, co => min(co.values, d => d.date)),
        max(data, co => max(co.values, d => d.date))
      ])

    const yScale = scaleLinear().range([height / 4 - 20, 0])

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'axis x')
      .call(axisBottom(xScale).ticks(5))

    svg.append('g')
      .attr('class', 'axis y')
      .call(axisLeft(yScale).ticks(5))

    data = data.slice(0, 1)

    const symbols = svg.selectAll('.symbol')
      .data(data)
      .enter().append('g')
      .attr('class', 'symbol')
      .attr('transform', (d, i) => `translate(0, ${i * height / 4 + 10})`)

    drawMultipleLineChart(symbols, xScale, yScale, color, width)

    symbols.exit().remove()
  })
