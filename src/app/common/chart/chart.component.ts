import {
    Component,
    OnInit,
    OnChanges,
    Input,
    ElementRef,
    Renderer
} from '@angular/core';
import * as d3 from 'd3'

@Component({
    selector: 'chart',
    template: `
        <div class="chart-wrapper tac" [style.width.px]="dimension.width" [style.height.px]="dimension.height">
            <svg>
            </svg>
        </div>
    `,
    styleUrls: ['chart.component.css']
})

export class ChartComponent implements OnInit, OnChanges {
    private elementRef: any;

    previousData: any = [];
    @Input() data: Array<number> = [1, 2, 3, 4];
    @Input() title: any = 'This is Title';
    @Input() dimension: any = {
        width: 500,
        height: 300
    }
    @Input() remove: any = null;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef.nativeElement;
    }

    render(newValue) {
        this.previousData = this.data;

        var xScale = d3.scaleBand()
            .domain(d3.range(0, newValue.length))
            .range([0, this.dimension.width])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(newValue)])
            .range([0, this.dimension.height]);

        const colors = d3.scaleLinear()
            .domain([0, newValue.length, newValue.length, newValue.length])
            .range(['#16a085', 'teal'])

        const color = (data, i) => {
            return 'fill:' + colors(i)
        }

        if (this.elementRef !== null) {
            let d3ParentElement = d3.select(this.elementRef);
            d3ParentElement.select('.chart-wrapper').select('svg')
                .attr('width', this.dimension.width)
                .attr('height', this.dimension.height)
                .selectAll('rect')
                .data(newValue)
                .enter()
                .append('rect')
                .attr('style', (d, i) => color(d,i))
                .attr('width', xScale.bandwidth())
                .attr('x', (data, i) => xScale(i))
                .attr('height', 0)
                .attr('y', this.dimension.height)
                .transition()
                .attr('height', (d) => {
                    return yScale(d)
                })
                .attr('y', (d: any) => this.dimension.height - yScale(d))
                .delay((data, i) => i * 20)
                .duration(500)
                .ease(d3.easeElastic)
                .attr('class', 'bar')
        }
    }

    ngOnInit() {
        this.render(this.data);
    }

    removeAllElement() {
        const nodes = this.elementRef.querySelectorAll('.bar');
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
