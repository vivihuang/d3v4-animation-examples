import { area, curveCatmullRom } from 'd3-shape'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawMultipleAreaChart = (symbols, xScale, yScale, color) => {
  symbols.each(function(d) {
    const currentArea = area()
      .x(d => xScale(d.date))
      .y0(yScale(0))
      .y1(d => yScale(d.price))
      .curve(curveCatmullRom.alpha(0.5))

    yScale.domain([0, 0])

    const layer = select(this)

    layer.selectAll('.area')
      .attr('d', currentArea(d.values))
      .style('fill', color(d.key))

    yScale.domain([0, d.maxPrice])

    currentArea.y1(d => yScale(d.price))

    layer.selectAll('.area')
      .transition(easeTransition(0))
      .attr('d', currentArea(d.values))
  })
}