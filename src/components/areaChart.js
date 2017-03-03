import { area, curveCatmullRom } from 'd3-shape'
import { select } from 'd3-selection'

export const drawMultipleAreaChart = (svg, xScale, yScale, color, width, height, data) => {
  const symbols = svg.selectAll('.symbol')
    .data(data)
    .enter().append('g')
    .attr('class', 'symbol')
    .attr('transform', (d, i) => `translate(0, ${i * height / 4 + 10})`)

  symbols.each(function(d) {
    const currentArea = area()
      .x(d => xScale(d.date))
      .y0(yScale(0))
      .y1(d => yScale(d.price))
      .curve(curveCatmullRom.alpha(0.5))

    yScale.domain([0, d.maxPrice])

    const layer = select(this)

    layer.append('path')
      .attr('class', 'area')
      .attr('d', d => currentArea(d.values))
      .style('fill', d => color(d.key))
  })
}