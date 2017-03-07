import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawGroupedBarChart = (symbols, xScale, yScale, color, width, height) => {
  symbols.each(function(d, i) {
    const layer = select(this)

    layer.selectAll('rect')
      .data(d.values)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', v => xScale(v.date) + xScale.bandwidth() * (i - 2))
      .attr('y', v => yScale(v.price))
      .attr('width', xScale.bandwidth())
      .attr('height', v => height - yScale(v.price))
      .style('fill', color(d.key))
      .style('opacity', 0)
      .transition(easeTransition(0))
      .style('opacity', 1)
  })
}
