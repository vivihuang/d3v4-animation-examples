import { line, curveCatmullRom } from 'd3-shape'
import { timer } from 'd3-timer'
import { select } from 'd3-selection'

const drawLineChart = (symbols, xScale, yScale, k) => {
  const currentLine = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(curveCatmullRom.alpha(0.5))

  symbols.each(function (d) {
    const layer = select(this)

    yScale.domain([0, d.maxPrice])

    layer.selectAll('.line')
      .attr('d', d => currentLine(d.values.slice(0, k)))

    if (k === d.values.length) {
      layer.selectAll('.circle')
        .style('opacity', 1)

      layer.selectAll('.legend')
        .style('opacity', 1)
    }
  })
}

export const drawMultipleLineChart = (svg, xScale, yScale, color, width, height, data) => {
  const symbols = svg.selectAll('.symbol')
    .data(data)
    .enter().append('g')
    .attr('class', 'symbol')
    .attr('transform', (d, i) => `translate(0, ${i * height / 4 + 10})`)

  symbols.each(function(d) {
    let k = 1
    const n = d.values.length

    yScale.domain([0, d.maxPrice])

    const layer = select(this)

    layer.append('path')
      .attr('class', 'line')

    layer.append('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .attr('cx', width - 40)
      .attr('cy', d => yScale(d.values[n - 1].price))
      .style('fill', d => color(d.key))
      .style('opacity', 0)

    layer.append('text')
      .text(d => d.key)
      .attr('class', 'legend')
      .attr('transform', d => `translate(${width - 30}, ${yScale(d.values[n - 1].price)})`)
      .attr('dy', '0.3rem')
      .style('opacity', 0)

    const t = timer(() => {
      drawLineChart(symbols, xScale, yScale, k)
      if ((k += 2) >= n) {
        drawLineChart(symbols, xScale, yScale, n)
        t.stop()
      }
    })
  })
}