import { area, curveCatmullRom, line } from 'd3-shape'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 0, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawOverlappingAreaChart = (symbols, xScale, yScale, color, height, data) => {
  symbols.data(data)

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
      .transition(easeTransition())
      .attr('d', currentArea(d.values))
      .style('opacity', 0.5)

    layer.selectAll('.line')
      .transition(easeTransition())
      .attr('d', currentLine(d.values))
      .style('opacity', 1)

    const n = d.values.length
    const legendX = xScale(d.values[n - 1].date) + 20
    const legendY = yScale(d.values[n - 1].price)

    layer.selectAll('.legend')
      .transition(easeTransition())
      .attr('transform', `translate(${legendX}, ${legendY})`)
      .attr('dy', '1rem')
  })
}