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
const width = 400 - margin.right - margin.left
const height = 300 - margin.top - margin.bottom

const xScale = d3.scaleBand()
  .range([0, width])
  .padding(0.2)
const yScale = d3.scaleLinear()
  .range([height, 0])

const xAxis = d3.axisBottom(xScale)
const yAxis = d3
  .axisLeft(yScale)
  .ticks(5)

const svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .call(responsivefy)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .attr('class', 'x axis')

svg.append('g')
  .attr('class', 'y axis')

const drawData = (data) => {
  xScale.domain(data.map(d => d.letter))
  yScale.domain([0, d3.max(data, d => d.frequency)])

  svg.selectAll('.x.axis')
    .transition()
      .duration(300)
    .call(xAxis)

  svg.selectAll('.y.axis')
    .transition()
      .duration(300)
    .call(yAxis)

  const bars = svg.selectAll('.bar').data(data, d => d.letter)

  bars
    .exit()
      .transition()
        .duration(300)
      .attr('y', yScale(0))
      .attr('height', height - yScale(0))
    .remove()

  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', yScale(0))
    .attr('height', height - yScale(0))

  bars
    .transition()
      .duration(300)
    .attr('x', d => xScale(d.letter))
    .attr('y', d => yScale(d.frequency))
    .attr('width', d => xScale.bandwidth())
    .attr('height', d => height - yScale(d.frequency))
}

const replayData = (data) => {
  const slices = []
  for (let i = 0; i < data.length; i++) {
    slices.push(data.slice(0, i+1))
  }
  slices.forEach((slice, index) => {
    setTimeout(() => {
      drawData(slice)
    }, index * 300)
  })
}

d3.tsv('data.tsv')
  .row(d => ({
    letter: d.letter,
    frequency: d.frequency
  }))
  .get((error, data) => replayData(data))
