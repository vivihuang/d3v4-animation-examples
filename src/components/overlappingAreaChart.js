import { area, curveCatmullRom, line } from 'd3-shape'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawOverlappingAreaChart = (svg, xScale, yScale, color, width, height, data) => {
  const symbols = svg.selectAll('.symbol')
    .data(data)

  symbols.each(function(d, i) {
    const currentArea = area()
      .x(d => xScale(d.date))
      .y0(yScale(0))
      .y1(d => yScale(d.price))
      .curve(curveCatmullRom.alpha(0.5))

    const currentLine = line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.price))
      .curve(curveCatmullRom.alpha(0.5))

    const layer = select(this)

    yScale.range([height, height / data.length * i])
      .domain([0, d.maxPrice])

    layer.selectAll('.area')
      .transition(easeTransition(0))
      .attr('d', currentArea(d.values))
      .style('opacity', 0.5)

    layer.selectAll('.line')
      .transition(easeTransition(0))
      .attr('d', currentLine(d.values))
      .style('opacity', 1)

    const n = d.values.length

    layer.selectAll('.legend')
      .transition(easeTransition(0))
      .attr('transform', `translate(${width - 30}, ${yScale(d.values[n - 1].price)})`)
      .attr('dy', '1rem')
  })
}