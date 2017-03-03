import { select } from 'd3-selection'

export const responsivefy = (svg) => {
  const resize = () => {
    const targetWidth = parseInt(container.style('width'))
    svg.attr('width', targetWidth)
    svg.attr('height', Math.round(targetWidth / aspect))
  }

  const container = select(svg.node().parentNode)
  const width = parseInt(svg.style('width'))
  const height = parseInt(svg.style('height'))
  const aspect = width / height

  svg.attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize)

  select(window).on(`resize.${container.attr('id')}`, resize)
}
