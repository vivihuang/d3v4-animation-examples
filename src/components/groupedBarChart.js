import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawGroupedBarChart = (symbols, xScale, x1Scale, yScale, color, width, height) => {

  symbols.each(function(d) {
    const layer = select(this)

    layer.selectAll('.bar')
      .data(d.values)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', v => xScale(v.date) + x1Scale(d.key))
      .attr('y', v => yScale(v.price))
      .attr('width', x1Scale.bandwidth())
      .attr('height', v => height - yScale(v.price))
      .style('fill', color(d.key))
      .style('opacity', 0)
      .transition(easeTransition(0))
      .style('opacity', 1)
  })
}
