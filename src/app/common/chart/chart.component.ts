import { Component, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'chart',
    template: `
        <div class="chart-wrapper tac" [style.width.px]="dimension.width + margin.left + margin.right">
            <template [ngIf]="type == 'bar'">
                <bar-chart [title]="'Finance Report'" [dimension]="dimension" [data]="data" [margin]="margin"></bar-chart>
            </template>
             <template [ngIf]="type == 'line'">
                <line-chart [title]="'Finance Report'" [dimension]="dimension" [data]="data" [margin]="margin"></line-chart>
            </template>
        </div>
    `,
    styleUrls: ['chart.component.css']
})

export class ChartComponent {
    private elementRef: any;
    @Input() data: Array<number> = [1, 2, 3, 4];
    @Input() title: any = 'This is Title';
    @Input() dimension: any = {
        width: 500,
        height: 300
    };
    @Input() type: 'line' | 'bar' = 'bar';
    margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
    }

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef.nativeElement;
    }

    createSvg(chart) {
        const d3ParentElement = d3.select(this.elementRef.closest('chart'));
        return d3ParentElement.select('.chart-wrapper').append("svg")
            .attr("width", chart.width + this.margin.left + this.margin.right)
            .attr("height", chart.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    removeAllElement() {
        const nodes = this.elementRef.querySelectorAll('svg')
        if (nodes) {
            Array.prototype.slice.call(nodes).map(res => {
                res.parentNode.removeChild(res);
            })
        }
    }
}