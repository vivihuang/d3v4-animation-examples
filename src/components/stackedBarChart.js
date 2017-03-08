import { select } from 'd3-selection'
import { stack, stackOrderReverse } from 'd3-shape'
import { max } from 'd3-array'
import { scaleBand } from 'd3-scale'

export const drawStackedBarChart = (symbols, xScale, x1Scale, yScale, width, height, originData, entryData) => {
  const keys = originData.map(d => d.key)

  const currentStack = stack()
    .keys(keys)
    .order(stackOrderReverse)

  const stackedData = currentStack(entryData)

  const x2Scale = scaleBand()
    .domain(originData[0].values.map(d => d.date))
    .range([50, width - 110])
    .paddingInner(0.1)
    .paddingOuter(1)

  yScale.domain([0, max(stackedData, d => max(d, v => v[1]))])
    .range([height, 0])

  symbols.data(stackedData)

  symbols.each(function(d, i) {
    const layer = select(this)

    layer.selectAll('.bar')
      .data(d)
      .transition()
        .delay((v, j) => j * 10)
        .attr('x', v => xScale(v.data.date) + x1Scale(originData[i].key))
        .attr('y', v => yScale(v[1]))
        .attr('width', x1Scale.bandwidth() * 2)
        .attr('height', v => yScale(v[0]) - yScale(v[1]))
        .style('stroke', '#fff')

      window.setTimeout(() => {
        layer.selectAll('.bar')
          .transition()
          .delay((v, j) => j * 10)
          .attr('x', v => x2Scale(v.data.date))
          .attr('y', v => yScale(v[1]))
          .attr('width', x2Scale.bandwidth())
          .attr('height', v => yScale(v[0]) - yScale(v[1]))
      }, 500)
  })
}
