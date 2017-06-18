import {
    Component,
    OnChanges,
    Input,
    ElementRef,
    Renderer
} from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

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
    margin = {
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

        const tooltip = d3.select("body").append("div").attr("class", "toolTip");

        const handleMouseOver = (d, i, e) => {
            const bound = e[i].getBoundingClientRect();
            tooltip
                .style("left", bound.left + "px")
                .style("top", bound.top + "px")
                .style("display", "inline-block")
                .style('position', 'absolute')
                .style('background-color', '#000')
                .style('width', bound.width + 'px')
                .style('color', '#fff')
                .style('text-align', 'center')
                .style('opacity', '0.5')
                .html(d.name + '<br>' + d.val);
        }

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
                .call(xAxis)
                .append("text")
                .attr("y", 30)
                .attr("x", width / 2)
                .style("text-anchor", "end")
                .text("Month");


            const title = svg.append("g")
                .append("text")
                .attr('class', 'title')
                .attr("y", -10)
                .style("text-anchor", "end")
                .text(this.title);

            const titleElem = this.elementRef.querySelector('.title');
            const titleWidth = titleElem.getBoundingClientRect().width;
            title.attr("x", width / 2 + (titleWidth/2));

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Value");

            svg.call(tip);

            const bar = svg.selectAll('rect')
                .data(newValue)
                .enter()

            const react = bar.append('rect')
                .attr('style', (d, i) => color(d.val, i))
                .attr('width', xScale.bandwidth())
                .attr('x', (d) => xScale(d.name))
                .attr('height', 0)
                .attr('y', height)
                .on("mouseover", handleMouseOver)
                .on("mouseout", (d) => { tooltip.style("display", "none"); })
                .attr('class', 'bar')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)


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
