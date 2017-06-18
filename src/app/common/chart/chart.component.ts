import {
    Component,
    OnChanges,
    Input,
    ElementRef,
    Renderer
} from '@angular/core';
import * as d3 from 'd3'

@Component({
    selector: 'chart',
    template: `
        <div class="chart-wrapper tac" [style.width.px]="dimension.width + margin.left + margin.right">
        </div>
    `,
    styleUrls: ['chart.component.css']
})

export class ChartComponent implements OnChanges {
    private elementRef: any;

    previousData: any = [];
    @Input() data: Array<number> = [1, 2, 3, 4];
    @Input() title: any = 'This is Title';
    @Input() dimension: any = {
        width: 500,
        height: 300
    }
    @Input() margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
    }
    @Input() remove: any = null;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef.nativeElement;
    }

    render(newValue) {
        const width = this.dimension.width - this.margin.left - this.margin.right;
        const height = this.dimension.height - this.margin.top - this.margin.bottom;
        const val = newValue.map(res => res.val)
        this.previousData = this.data;

        const formatPercent = d3.format(".00000%");

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

        const colors = d3.scaleLinear()
            .domain([0, newValue.length, newValue.length, newValue.length])
            .range(['#16a085', 'teal'])

        const color = (data, i) => {
            return 'fill:' + colors(i)
        }

        const tooltip = d3.select("body").append("div").attr("class", "toolTip");

        if (this.elementRef !== null) {
            const d3ParentElement = d3.select(this.elementRef);
            const svg = d3ParentElement.select('.chart-wrapper').append("svg")
                .attr("width", width + this.margin.left + this.margin.right)
                .attr("height", height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

            const bar = svg.selectAll('rect')
                .data(newValue)
                .enter()

            const react = bar.append('rect')
                .attr('style', (d, i) => color(d.val, i))
                .attr('width', xScale.bandwidth())
                .attr('x',(d) => xScale(d.name))
                .attr('height', 0)
                .attr('y', height)
                .attr('class', 'bar')

            const reactTransition = react.transition()
                .attr('height', (d, i, e) => {
                    return height - yScale(d.val)
                })
                .attr('y', (d: any) => yScale(d.val))
                .delay((data, i) => i * 20)
                .duration(500)
                .ease(d3.easeElastic)

        }
    }


    removeAllElement() {
        const nodes = this.elementRef.querySelectorAll('svg');
        if (nodes) {
            Array.prototype.slice.call(nodes).map(res => {
                res.parentNode.removeChild(res);
            })
        }
    }

    ngOnChanges() {
        this.removeAllElement();
        this.render(this.data)
    }
}
