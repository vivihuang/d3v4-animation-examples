const responsivefy = (svg) => {
  const resize = () => {
    const targetWidth = parseInt(container.style('width'))
    svg.attr('width', targetWidth)
    svg.attr('height', Math.round(targetWidth / aspect))
  }

  const container = d3.select(svg.node().parentNode)
  const width = parseInt(svg.style('width'))
  const height = parseInt(svg.style('height'))
  const aspect = width / height

  svg.attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize)

  d3.select(window).on(`resize.${container.attr('id')}`, resize)
}

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 960 - margin.right - margin.left
const height = 600 - margin.top - margin.bottom

const svg = d3.select('.chart')
  .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy)
