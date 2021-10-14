// write your javascript code here.
// feel free to change the pre-set attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35,
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

//SVG that will hold the visualization
let svg1 = d3
  .select('#d3-container')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '60%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', 'white')
  .style('border', 'solid')
  .attr(
    'viewBox',
    [
      0,
      0,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom,
    ].join(' ')
  );

var svg = d3.select('svg');

var xScale = d3.scaleBand().range([0, width]).padding(0.4),
  yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append('g').attr('transform', 'translate(' + 50 + ',' + 50 + ')');
var Tooltip;
// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
  // create a tooltip
  Tooltip = d3
    .select('#d3-container')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');
  Tooltip.style('opacity', 1);
  d3.select(this).style('stroke', 'black').style('opacity', 1);
};
var mousemove = function (d) {
  Tooltip.html('The value of<br>this bar is: ' + d.path[0].__data__.Y)
    .style('left', d.clientX + 20 + 'px')
    .style('top', d.clientY + 'px');
};
var mouseleave = function (d) {
  Tooltip.style('opacity', 0);
  Tooltip.remove();
  d3.select(this).style('stroke', 'none').style('opacity', 1);
};

d3.csv('./data/data.csv').then(function (data) {
  xScale.domain(
    data.map(function (d) {
      return d.X;
    })
  );
  yScale.domain([
    0,
    d3.max(data, function (d) {
      return d.Y;
    }),
  ]);

  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d;
        })
        .ticks(10)
    )
    .append('text')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('value');

  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return xScale(d.X);
    })
    .attr('y', function (d) {
      return yScale(d.Y);
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d) {
      return height - yScale(d.Y);
    })
    .attr('fill', 'rgb(230,132,91)')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);
});
