import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-barchart',
  templateUrl: './d3-barchart.component.html',
  styleUrls: ['./d3-barchart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class D3BarchartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.renderDiv();
    this.renderSvg();
    this.renderFromTsv();
    this.renderRotated();
    this.renderRealTime();
  }

  private renderDiv() {
    const data = [4, 8, 15, 16, 23, 42];
    const width = 420;
    const x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width]);
    const chartDiv = d3.select('.chart_div')
      .selectAll('div')
      .data(data)
      .enter()
      .append('div')
      .style('width', (d) => x(d) + 'px')
      .text((d) => d);
  }

  private renderSvg() {
    const data = [4, 8, 15, 16, 23, 42];
    const width = 420;
    const barHeight = 20;
    const x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 420]);

    const chartSvg = d3.select('.chart_svg')
      .attr('width', width)
      .attr('height', barHeight * data.length);

    const bar = chartSvg.selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', (d, i) => `translate(0, ${i * barHeight})`);

    bar.append('rect')
      .attr('width', x)
      .attr('height', barHeight - 1);

    bar.append('text')
      .attr('x', (d) => x(d) - 3)
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text((d) => d);
  }

  private renderFromTsv() {
    const width = 420;
    const barHeight = 20;
    const x = d3.scaleLinear()
      .range([0, width]);

    const chartSvg = d3.select('.chart_svg_tsv')
      .attr('width', width);

    d3.tsv('/assets/d3.tsv').then((values) => {
      const data = values.map((d) => +d.value);
      x.domain([0, d3.max(data)]);


      const bar = chartSvg.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(0, ${i * barHeight})`);

      bar.append('rect')
        .attr('width', (d) => x(d))
        .attr('height', barHeight - 1);

      bar.append('text')
        .attr('x', (d) => x(d) - 3)
        .attr('y', barHeight / 2)
        .attr('dy', '.35em')
        .text((d) => d);
    });
  }

  private renderRotated() {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(10, '%');

    const chart = d3.select('.chart_svg_rotated')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    d3.tsv('/assets/d3.tsv').then((values) => {
      x.domain(values.map((d) => d.name));
      y.domain([0, d3.max(values, (d) => +d.value)]);

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('fill', 'steelblue')
        .text('Frequency');


      chart.selectAll('.bar')
        .data(values)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.name))
        .attr('y', (d) => y(+d.value))
        .attr('height', (d) => height - y(+d.value))
        .attr('width', x.bandwidth());

      // const bar = chart.selectAll('g')
      //   .data(values)
      //   .enter().append('g')
      //   .attr('transform', (d, i) => `translate(${x(d.name) }, 0)`);

      // bar.append('rect')
      //   .attr('y', (d) => y(+d.value))
      //   .attr('height', (d) => height - y(+d.value))
      //   .attr('width', x.bandwidth());

      // bar.append('text')
      //   .attr('x', x.bandwidth() / 2)
      //   .attr('y', (d) => y(+d.value) + 3)
      //   .attr('dy', '.75em')
      //   .text((d) => d.value);

    });
  }

  private renderRealTime() {
    const t = setInterval(updateChart, 300);

    const margin = {
      top: 5,
      right: 5,
      bottom: 50,
      left: 30
    };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#chart_real_time')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('defs').append('clipPath')
      .attr('id', 'clip2')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);

    const parseTime = d3.timeParse('%Y%m%d');

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleOrdinal(d3.schemeCategory10);

    y.domain([0, 30]);

    const line = d3.line()
      .curve(d3.curveBasis)
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.speed));

    const dta = [
      { id: 'miner1', values: [] },
      { id: 'miner2', values: [] },
      { id: 'miner3', values: [] },
      { id: 'miner4', values: [] }
    ];

    z.domain(dta.map((c) => c.id));

    const xAxis = d3.axisBottom(x);
    const xAxisSvg = g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);


    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text('Speed');

    const pathsG = g.append('g').attr('id', 'paths').attr('class', 'paths')
      .attr('clip-path', 'url(#clip2)');

    const duration = 300; // how quickly to move (will look jerky if less that data input rate)
    const limit = 60; // how many datapoints, total points = (duration * limit)

    function updateChart() {

      const now = new Date().getTime();
      dta.forEach((e) => {
        const last = e.values.length ? e.values[e.values.length - 1].speed : 10;
        const newv = Math.round(Math.min(30, Math.max(0, last + (Math.random() * 6) - 3)));
        e.values.push({
          date: now,
          speed: newv
        });
      });

      // Shift domain
      x.domain([now - ((limit - 2) * duration), now - duration]);
      // Slide x-axis left
      xAxisSvg.transition().duration(duration).ease(d3.easeLinear).delay(2).call(xAxis);

      // Join
      const minerG: any = pathsG.selectAll('.minerLine').data(dta);
      const minerGEnter = minerG.enter()
        // Enter
        .append('g')
        .attr('class', 'minerLine')
        .merge(minerG);

      // Join
      const minerSVG = minerGEnter.selectAll('path').data((d) => [d]);
      const minerSVGenter = minerSVG.enter()
        // Enter
        .append('path').attr('class', 'line')
        .style('stroke', (d) => z(d.id))
        .merge(minerSVG)
        // Update
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .delay(2)
        .attr('d', (d) => line(d.values))
        .attr('transform', null);

      const minerText: any = d3.select('#legend').selectAll('div').data(dta);
      const minerEnter = minerText.enter()
        .append('div')
        .attr('class', 'legenditem')
        .style('color', (d) => z(d.id))
        .merge(minerText)
        .text((d) => d.id + ':' + d.values[d.values.length - 1].speed);

    }
  }

}
