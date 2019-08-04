import { Component, OnInit, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-real-time',
  templateUrl: './chart-real-time.component.html',
  styleUrls: ['./chart-real-time.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartRealTimeComponent implements OnInit, OnChanges {

  @Input() incomingData: {
    [miner: string]: {
      values: {
        date: number,
        speed: number
      }
    }
  };
  private counter = 0;
  private minersData = [
    { id: 'miner1', values: [] },
    { id: 'miner2', values: [] },
    { id: 'miner3', values: [] },
    { id: 'miner4', values: [] }
  ];
  private x: d3.ScaleTime<number, number>;
  private z: d3.ScaleOrdinal<string, string>;
  private line: d3.Line<[number, number]>;
  private xAxisSvg: d3.Selection<any, any, any, any>;
  private xAxis: d3.Axis<any>;
  private pathsG: d3.Selection<any, any, any, any>;

  constructor() { }

  ngOnChanges() {
    if (this.incomingData) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const screenWidth = document.querySelector('body').offsetWidth;
    const margin = {
      top: 5,
      right: 5,
      bottom: 50,
      left: 30
    };
    const width = screenWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('.chart_real_time')
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

    this.x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    this.z = d3.scaleOrdinal(d3.schemeCategory10);

    y.domain([0, 30]);

    this.line = d3.line()
      .curve(d3.curveBasis)
      .x((d: any) => this.x(d.date))
      .y((d: any) => y(d.speed));

    this.z.domain(this.minersData.map((c) => c.id));

    this.xAxis = d3.axisBottom(this.x);
    this.xAxisSvg = g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.xAxis);


    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text('Speed');

    this.pathsG = g.append('g').attr('id', 'paths').attr('class', 'paths')
      .attr('clip-path', 'url(#clip2)');
  }

  updateChart() {
    const duration = 500; // how quickly to move (will look jerky if less that data input rate)
    const limit = 60; // how many datapoints, total points = (duration * limit)

    this.minersData.forEach((e) => {
      const value = this.incomingData[e.id];
      e.values.push({
        date: value.values.date,
        speed: value.values.speed
      });
    });
    this.counter++;

    const now = d3.max(this.minersData, (d) => {
      const l = d.values.length;
      if (l === 0) {
        return new Date().getTime();
      }
      return d.values[l - 1].date;
    });

    // Shift domain
    this.x.domain([now - ((limit - 2) * duration), now - duration]);
    // Slide x-axis left
    this.xAxisSvg.transition().duration(duration).ease(d3.easeLinear).delay(2).call(this.xAxis);

    // Join
    const minerG: any = this.pathsG.selectAll('.minerLine').data(this.minersData);
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
      .style('stroke', (d) => this.z(d.id))
      .merge(minerSVG)
      // Update
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .delay(2)
      .attr('d', (d) => this.line(d.values))
      .attr('transform', null);

    const minerText: any = d3.select('.legend').selectAll('div').data(this.minersData);
    const minerEnter = minerText.enter()
      .append('div')
      .attr('class', 'legenditem')
      .style('color', (d) => this.z(d.id))
      .merge(minerText)
      .text((d) => d.id + ':' + d.values[d.values.length - 1].speed);

    if (this.counter > 50) {
      console.log('Clean memory');
      this.counter = 0;
      this.minersData.forEach((miner) => {
        miner.values.shift();
      });
    }

  }

}
