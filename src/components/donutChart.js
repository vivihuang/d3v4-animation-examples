import { select } from 'd3-selection'
import { arc, pie } from 'd3-shape'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'

const easeTransition = (delayTime = 0, durationTime = 800) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawDonutChart = (symbols, xScale, yScale, width, height, color, data) => {
  const currentPie = pie()
    .sort(null)
    .value(d => d.sumPrice)

  const arcTween = (arcData, layer) => {
    const x0 = xScale(arcData.data.key)
    const y0 = height - yScale(arcData.data.sumPrice)

    return function(t) {
      const r = height / 2.5 / Math.min(1, t + 1e-3)
      const a = Math.cos(t * Math.PI / 2)
      const xx = -r + a * (x0 + xScale.bandwidth()) + (1 - a) * (width + height) / 2
      const yy = a * height + (1 - a) * height / 2

      const currentArc = arc()
        .innerRadius(r - xScale.bandwidth() / (2 - a))
        .outerRadius(r)
        .startAngle(a * (Math.PI / 2 - y0 / r) + (1 - a) * arcData.startAngle)
        .endAngle(a * (Math.PI / 2) + (1 - a) * arcData.endAngle)

      const centroidX = currentArc.centroid()[0]
      const centroidY = currentArc.centroid()[1]

      layer.selectAll('.arc')
        .attr('d', currentArc)
        .attr('transform', `translate(${xx}, ${yy})`)

      layer.selectAll('.legend')
        .attr('transform', `translate(${centroidX + xx}, ${centroidY + yy})`)
    }
  }

  symbols.data(currentPie(data))

  symbols.each(function(d, i) {
    const layer = select(this)

    layer.selectAll('.bar').remove()

    layer.selectAll('.arc')
      .style('fill', color(data[i].key))
      .transition(easeTransition())
      .tween('d', () => arcTween(d, layer))
  })
}
