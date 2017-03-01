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
    // .call(responsivefy)

const path = d3.geoPath()
  .projection(null)

const color = d3.scaleLinear()
  .domain([0, 50000])
  .range(colorbrewer.Greens[7])

const drawMap = (us) => {
  svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'border nation')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.nation).features)
    .enter().append('path')
      .attr('d', path)

  svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'border counties')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append('path')
      .attr('d', path)
      .attr('class', 'county')
      .style('fill', d => color(d.id))

  svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'border states')
    .append('path')
      .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))
}

d3.json('us_10m.json', (error, us) => {
  if (error) {
    throw error
  }
  drawMap(us)
})
