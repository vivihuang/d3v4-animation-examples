import { select } from 'd3-selection'

export const drawTransposeBarChart = (symbols, xScale, yScale, width, height) => {
  symbols.each(function(d) {
    const layer = select(this)
    const n = d.values.length

    layer.selectAll('.legend')
      .attr('transform', `translate(${xScale(d.key) + xScale.bandwidth() / 2}, ${height})`)
      .style('text-anchor', 'middle')

    layer.selectAll('.bar')
      .data(d.values)
      .transition()
        .delay((v, i) => i * 10)
        .attr('x', xScale(d.key))
        .attr('y', (v, i) => height - (height - yScale(d.sumPrice)) / n * (i + 1))
        .attr('width', xScale.bandwidth())
        .attr('height', (height - yScale(d.sumPrice)) / n)
        .style('stroke', null)
  })
}
