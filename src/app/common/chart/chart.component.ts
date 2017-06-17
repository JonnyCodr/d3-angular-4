import {
    Component,
    OnInit,
    OnChanges,
    Input,
    ElementRef
} from '@angular/core';
import * as d3 from 'd3'

@Component({
    selector: 'chart',
    template: `
        <div class="chart-wrapper tac" [style.width.px]="dimension.width" [style.height.px]="dimension.height">
            <h2 class="chart-title">{{ title }}</h2>
        </div>
    `,
    styleUrls: ['chart.component.css']
})

export class ChartComponent implements OnInit, OnChanges {
    elementRef: ElementRef;
    @Input() data: Array<number> = [1, 2, 3, 4];
    @Input() title: any = 'This is Title';
    @Input() dimension: any = {
        width: 500,
        height: 300
    }

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef.nativeElement;
    }

    render(newValue) {
        d3.select(this.elementRef).select('.chart-wrapper').selectAll('div')
            .data(newValue)
            .enter()
            .append('div')
            .attr('class', 'bar')
            .style('height', d => d + '%')
    }

    ngOnInit() {
        console.log('D3 wrapper initialized');
        this.render(this.data);
    }

    ngOnChanges() {
        this.render(this.data)
    }
}
