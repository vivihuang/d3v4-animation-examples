import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'
import { stack, stackOrderReverse } from 'd3-shape'
import { max } from 'd3-array'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawStackedBarChart = (symbols, xScale, x1Scale, yScale, color, width, height, originData, entryData) => {
  const keys = originData.map(d => d.key)

  const currentStack = stack()
    .keys(keys)
    .order(stackOrderReverse)

  const stackedData = currentStack(entryData)

  yScale.domain([0, max(stackedData, d => max(d, v => v[1]))])
    .range([height, 0])

  symbols.data(stackedData)

  symbols.each(function(d, i) {
    const layer = select(this)

    layer.selectAll('.bar')
      .data(d)
      .transition()
        .delay((v, j) => j * 10)
        .attr('x', v => xScale(v.data.date) + x1Scale(originData[i].key))
        .attr('y', v => yScale(v[1]))
        .attr('width', x1Scale.bandwidth() * 2)
        .attr('height', v => yScale(v[0]) - yScale(v[1]))
        .style('stroke', '#fff')

    window.setTimeout(() => {
      xScale.range([50, width - 110]).paddingInner(0.2).paddingOuter(1)

      layer.selectAll('.bar')
        .transition(easeTransition(0))
        .attr('x', v => xScale(v.data.date))
        .attr('y', v => yScale(v[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', v => yScale(v[0]) - yScale(v[1]))
    }, d.length * 10)
  })
}
