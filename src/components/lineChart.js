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
    }
  })
}

export const drawMultipleLineChart = (symbols, xScale, yScale, color, width) => {
  symbols.each(function(d) {
    let k = 1
    const n = d.values.length

    yScale.domain([0, d.maxPrice])

    const layer = select(this)

    layer.append('path')
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', '#000')

    layer.append('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .attr('cx', width)
      .attr('cy', d => yScale(d.values[n - 1].price))
      .style('fill', d => color(d.key))
      .style('stroke', '#000')
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