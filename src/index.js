import 'babel-polyfill'
import { select } from 'd3-selection'

import { circleWave } from './components/circleWave'
import './styles.css'

const margin = { top: 20, right: 20, bottom: 20, left: 20 }
const width = 1000 - margin.right - margin.left
const height = 500 - margin.top - margin.bottom

const svg = select('.chart')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

circleWave(svg, width, height)
