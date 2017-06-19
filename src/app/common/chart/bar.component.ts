import { ChartComponent } from './chart.component';
import { Component, ElementRef, Input, OnChanges, Renderer } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Component({
    selector: 'bar-chart',
    template: `
        <div class="chart-wrapper tac" [style.width.px]="dimension.width + margin.left + margin.right">
        </div>
    `,
    styleUrls: ['chart.component.css']
})

export class BarChartComponent implements OnChanges {
    elementRef: any;

    previousData: any = [];
    @Input() data: Array<number> = [1, 2, 3, 4];
    @Input() title: any = 'This is Title';
    @Input() dimension: any = {
        width: 500,
        height: 300
    };
    @Input() type: 'line' | 'bar' = 'bar';
    @Input() margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
    }
    @Input() remove: any = null;

    constructor(elementRef: ElementRef, private chart: ChartComponent) {
        this.elementRef = elementRef.nativeElement;
    }

    initialDeclarations(newValue) {
        const tip = d3Tip().attr('class', 'd3-tip').html((d) => d.val);
        const width = this.dimension.width - this.margin.left - this.margin.right;
        const height = this.dimension.height - this.margin.top - this.margin.bottom;
        const val = newValue.map(res => res.val)
        this.previousData = this.data;

        const format = d3.format(["$", ""]);

        const xScale = d3.scaleBand()
            .domain(newValue.map(res => res.name))
            .rangeRound([0, width], .1)

        const yScale = d3.scaleLinear()
            .domain([d3.max(val), 0])
            .range([0, height]);

        const xAxis = d3.axisBottom()
            .scale(xScale);

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .tickFormat(format)

        const colors = d3.scaleLinear()
            .domain([0, newValue.length, newValue.length, newValue.length])
            .range(['#16a085', 'teal'])

        const color = (data, i) => {
            return 'fill:' + colors(i)
        }

        return Object.assign({}, {
            tip, width, height, xScale, yScale, xAxis, yAxis, color
        })
    }

    createXAxis(chart, svg) {
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chart.height + ")")
            .call(chart.xAxis)
            .append("text")
            .attr("y", 30)
            .attr("x", chart.width / 2)
            .style("text-anchor", "end")
            .text("Month");
    }

    createTitle(chart, svg) {
        const title = svg.append("g")
            .append("text")
            .attr('class', 'title')
            .attr("y", -10)
            .style("text-anchor", "end")
            .text(this.title);

        const titleElem = this.elementRef.closest('chart').querySelector('.title');
        const titleWidth = titleElem.getBoundingClientRect().width;
        title.attr("x", chart.width / 2 + (titleWidth / 2));
    }

    createYAxis(chart, svg) {
        svg.append("g")
            .attr("class", "y axis")
            .call(chart.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Value");
    }

    createBar(chart, svg, data) {
        const bar = svg.selectAll('rect')
            .data(data)
            .enter()

        const rect = bar.append('rect')
            .attr('style', (d, i) => chart.color(d.val, i))
            .attr('width', chart.xScale.bandwidth())
            .attr('x', (d) => chart.xScale(d.name))
            .attr('height', 0)
            .attr('y', chart.height)
            .attr('class', 'bar')
            .on('mouseover', chart.tip.show)
            .on('mouseout', chart.tip.hide)

        rect.transition()
            .attr('height', (d, i, e) => {
                return chart.height - chart.yScale(d.val)
            })
            .attr('y', (d: any) => chart.yScale(d.val))
            .delay((data, i) => i * 20)
            .duration(500)
            .ease(d3.easeElastic)
    }

    render(newValue) {
        const chart = this.initialDeclarations(newValue);
        const svg = this.chart.createSvg(chart);
        if (this.elementRef !== null) {
            this.createXAxis(chart, svg)
            this.createTitle(chart, svg);
            this.createYAxis(chart, svg);
            svg.call(chart.tip);
            this.createBar(chart, svg, newValue)
        }
    }

    ngOnChanges() {
        this.chart.removeAllElement();
        this.render(this.data)
    }
}
