import { stack, area, curveCatmullRom, line, stackOrderReverse, stackOffsetWiggle } from 'd3-shape'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawStreamGraphChart = (symbols, xScale, yScale, color, height, originData, entryData) => {
  const keys = originData.map(d => d.key)

  const currentStack = stack()
    .keys(keys)
    .order(stackOrderReverse)
    .offset(stackOffsetWiggle)

  const stackedData = currentStack(entryData)

  yScale.domain([0, max(stackedData, d => max(d, v => v[1]))])
    .range([height, 0])

  const currentArea = area()
    .x(d => xScale(d.data.date))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(curveCatmullRom.alpha(0.5))

  const currentLine = line()
    .x(d => xScale(d.data.date))
    .y(d => yScale(d[0]))
    .curve(curveCatmullRom.alpha(0.5))

  symbols.data(stackedData)

  symbols.each(function(d, i) {
    const layer = select(this)

    layer.transition(easeTransition())
      .attr('transform', 'translate(0, 0)')

    layer.selectAll('.area')
      .transition(easeTransition())
      .attr('d', currentArea(d))

    layer.selectAll('.line')
      .transition(easeTransition())
      .attr('d', currentLine(d))
      .style("opacity", 0)

    const legendX = xScale(d[d.length - 1].data.date) + 20
    let legendY = (yScale(d[d.length - 1][0]) + yScale(d[d.length - 1][1])) / 2

    if (legendY > height) {
      legendY = height
    }

    layer.selectAll('.legend')
      .transition(easeTransition())
      .attr('transform', `translate(${legendX}, ${legendY})`)
      .attr('dy', '0.3rem')
  })
}
