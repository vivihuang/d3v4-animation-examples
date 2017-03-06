import { line, curveCatmullRom } from 'd3-shape'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 500, durationTime = 1000) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

const hideAllShapes = (layer, xScale, yScale, width, data) => {
  const currentLine = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(curveCatmullRom.alpha(0.5))

  yScale.domain([0, 0])

  layer.selectAll('.circle')
    .style('opacity', 0)
    .remove()

  layer.selectAll('.legend')
    .transition(easeTransition(200, 1000))
    .attr('transform', `translate(${width - 30}, ${yScale(0)})`)
    .attr('dy', '0')

  layer.selectAll('.line')
    .transition(easeTransition(200, 1000))
    .attr('d', currentLine(data.values))
}

export const drawMultipleLineChart = (svg, xScale, yScale, color, width, height, data) => {
  const currentLine = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(curveCatmullRom.alpha(0.5))

  const symbols = svg.selectAll('.symbol')
    .data(data)
    .enter().append('g')
    .attr('class', 'symbol')
    .attr('transform', (d, i) => `translate(0, ${i * height / 4 + 10})`)

  symbols.each(function(d) {
    const layer = select(this)

    const n = d.values.length

    yScale.domain([0, 0])

    layer.append('path')
      .attr('class', 'line')
      .attr('d', currentLine(d.values))

    yScale.domain([0, d.maxPrice])

    layer.selectAll('.line')
      .transition(easeTransition())
      .attr('d', currentLine(d.values))

    layer.append('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .attr('cx', width - 40)
      .attr('cy', yScale(d.values[n - 1].price))
      .style('fill', color(d.key))
      .style('opacity', 0)
      .transition(easeTransition(1500, 500))
        .style('opacity', 1)

    layer.append('text')
      .text(d.key)
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 30}, ${yScale(d.values[n - 1].price)})`)
      .attr('dy', '0.3rem')
      .style('opacity', 0)
      .transition(easeTransition(1500, 500))
        .style('opacity', 1)

    window.setTimeout(() => {
      hideAllShapes(layer, xScale, yScale, width, d)
    }, 2500)
  })
}
