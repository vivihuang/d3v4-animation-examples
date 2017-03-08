import { select } from 'd3-selection'
import { arc } from 'd3-shape'
import { transition } from 'd3-transition'
import { easeSinInOut } from 'd3-ease'
import { interpolate } from 'd3-interpolate'

const easeTransition = (delayTime = 200, durationTime = 500) => {
  return transition()
    .delay(delayTime)
    .duration(durationTime)
    .ease(easeSinInOut)
}

export const drawDonutExplodeChart = (symbols, xScale, yScale, width, height) => {
   const r0a = height / 2 - xScale.bandwidth() / 2
   const r1a = height / 2
   const r0b = 2 * height - xScale.bandwidth() / 2
   const r1b = 2 * height

  const innerInterpolate = interpolate(r0a,r0b)
  const outerInterpolate = interpolate(r1a,r1b)

  const arcTween = (arcData, layer) => {
    const x0 = xScale(arcData.data.key)

    return (t) => {
      const r = height / 2.5 / Math.min(1, t + 1e-3)
      const a = Math.cos(t * Math.PI / 2)
      const xx = -r + a * (x0 + xScale.bandwidth()) + (1 - a) * (width + height) / 2
      const yy = a * height + (1 - a) * height / 2

      const currentArc = arc()
        .innerRadius(innerInterpolate(t))
        .outerRadius(outerInterpolate(t))
        .startAngle(Math.PI * 2 * arcData.startAngle)
        .endAngle(Math.PI * 2 * arcData.endAngle)

      const centroidX = currentArc.centroid()[0]
      const centroidY = currentArc.centroid()[1]

      layer.selectAll('.arc')
        .attr('d', currentArc)

      layer.selectAll('.legend')
        .attr('transform', `translate(${centroidX + xx}, ${centroidY + yy})`)
    }
  }

  symbols.each(function(d) {
    const layer = select(this)

    layer.selectAll('.arc')
      .transition(easeTransition())
      .tween('d', () => arcTween(d, layer))
  })
}
