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

const hideAllShapes = (layer, xScale, yScale, data) => {
  const currentLine = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(curveCatmullRom.alpha(0.5))

  yScale.domain([0, 0])

  layer.selectAll('.circle')
    .style('opacity', 0)
    .remove()
  layer.selectAll('.legend')
    .style('opacity', 0)
    .remove()
  layer.selectAll('.line')
    .transition(easeTransition(200, 1000))
    .attr("d", currentLine(data.values))
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
      .attr('d', d => currentLine(d.values))

    yScale.domain([0, d.maxPrice])

    layer.selectAll('.line')
      .transition(easeTransition())
      .attr('d', d => currentLine(d.values))

    layer.append('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .attr('cx', width - 40)
      .attr('cy', d => yScale(d.values[n - 1].price))
      .style('fill', d => color(d.key))
      .style('opacity', 0)
      .transition(easeTransition(1500, 500))
        .style('opacity', 1)

    layer.append('text')
      .text(d => d.key)
      .attr('class', 'legend')
      .attr('transform', d => `translate(${width - 30}, ${yScale(d.values[n - 1].price)})`)
      .attr('dy', '0.3rem')
      .style('opacity', 0)
      .transition(easeTransition(1500, 500))
        .style('opacity', 1)

    window.setTimeout(() => {
      hideAllShapes(layer, xScale, yScale, d)
    }, 2500)
  })
}
