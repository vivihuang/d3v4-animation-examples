import { line, curveCatmullRom } from 'd3-shape'
import { timer } from 'd3-timer'
import { select } from 'd3-selection'

const drawLineChart = (symbols, xScale, yScale) => {
  const currentLine = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(curveCatmullRom.alpha(0.5))

  symbols.each(function (d) {
    const layer = select(this)
    yScale.domain([0, d.maxPrice]);

    layer.selectAll(".line")
      .attr("d", d => currentLine(d.values))

    layer.selectAll(".circle")
      .attr('cy', d => yScale(d.values[d.values.length - 1].price))
  })
}

export const drawMultipleLineChart = (symbols, xScale, yScale, color, width) => {
  symbols.each(function(d) {
    const layer = select(this)

    yScale.domain([0, d.maxPrice])

    layer.append('path')
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', '#000')

    layer.append('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .attr('cx', width)
      .style('fill', d => color(d.key))
      .style('stroke', '#000')

    drawLineChart(symbols, xScale, yScale)

    // timer(() => {
    //   drawLineChart(symbols, xScale, yScale, k)
    //   if ((k += 2) >= n - 1) {
    //     console.log(k, n, (k += 2) >= n - 1)
    //     drawLineChart(symbols, xScale, yScale, n - 1)
    //     return true
    //   }
    // })
  })
}