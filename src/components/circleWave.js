import { radialLine, curveLinearClosed } from 'd3-shape'
import { range } from 'd3-array'
import { timer, now } from 'd3-timer'

const radialLineGenerator = (angles, index) => {
  const currentLine = radialLine()
    .curve(curveLinearClosed)
    .angle(angle => angle)
    .radius((angle) => {
      const t = now() / 1000
      return 200 + Math.cos(angle * 8 - index * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(angle - t)) / 2, 3) * 32
    })
  return currentLine(angles)
}

export const circleWave = (svg, width, height) => {
  const colors = ['cyan', 'magenta', 'yellow']
  const angles = range(0, 2 * Math.PI, Math.PI / 200)

  const layers = svg.selectAll('.layer')
    .data(colors)
    .enter().append('path')
    .attr('class', 'layer')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  layers
    .style('stroke', d => d)
    .style('stroke-width', 10)
    .style('mix-blend-mode', 'darken')
    .style('fill', 'none')

  timer(() => { layers.attr('d', (d, i) => radialLineGenerator(angles, i)) })
}
