import { line, curveCatmullRom } from 'd3-shape'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'
import { timer } from 'd3-timer'

const easeTransition = (delayTime = 200, durationTime = 500) => {
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

  const n = data.values.length
  const positionX = xScale(data.values[n - 1].date) + 20

  layer.selectAll('.legend')
    .transition(easeTransition(0))
    .attr('transform', `translate(${positionX}, ${yScale(0)})`)
    .attr('dy', '0')

  layer.selectAll('.line')
    .transition(easeTransition(0))
    .attr('d', currentLine(data.values))
}

const drawLineChart = (symbols, xScale, yScale, k) => {
  const currentLine = line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price))
    .curve(curveCatmullRom.alpha(0.5))

  symbols.each(function (d) {
    const layer = select(this)

    yScale.domain([0, d.maxPrice])

    layer.selectAll('.line')
      .attr('d', d => currentLine(d.values.slice(0, k)))

    const positionX = xScale(d.values[k - 1].date) + 10
    const positionY = yScale(d.values[k - 1].price)

    layer.selectAll('.circle')
      .attr('cx', positionX)
      .attr('cy', positionY)

    layer.selectAll('.legend')
      .attr('transform', `translate(${positionX + 10}, ${positionY})`)
      .attr('dy', '0.3rem')
  })
}

export const drawMultipleLineChart = (symbols, xScale, yScale, color) => {
  symbols.each(function(d) {
    const layer = select(this)

    const n = d.values.length

    yScale.domain([0, d.maxPrice])

    layer.append('path')
      .attr('class', 'area')

    layer.append('path')
      .attr('class', 'line')

    layer.append('circle')
      .attr('class', 'circle')
      .attr('r', 5)
      .style('fill', color(d.key))

    let k = 1

    const t = timer(() => {
      drawLineChart(symbols, xScale, yScale, k)
      if ((k += 2) >= n) {
        drawLineChart(symbols, xScale, yScale, n)
        window.setTimeout(() => {
          hideAllShapes(layer, xScale, yScale, d)
        }, 500)
        t.stop()
      }
    })
  })
}
