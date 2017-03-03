import { stack, area, curveCatmullRom } from 'd3-shape'
import { select } from 'd3-selection'
import { max } from 'd3-array'

export const drawStackedAreaChart = (svg, xScale, yScale, color, width, height, data) => {
  const currentStack = stack()
    .keys(Object.keys(data[0]).filter(item => item !== 'date'))

  const symbols = svg.selectAll('.symbol')
    .data(currentStack(data))
    .enter().append('g')
    .attr('class', 'symbol')

  yScale.domain([0, max(currentStack(data), d => max(d, v => v[1]))])
    .range([height, 0])

  symbols.each(function(d) {
    const currentArea = area()
      .x(d => xScale(d.data.date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(curveCatmullRom.alpha(0.5))

    const layer = select(this)

    layer.append('path')
      .attr('class', 'area stacked-area')
      .attr('d', d => currentArea(d))
      .style('fill', d => color(d.key))
  })
}