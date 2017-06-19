import { ChartComponent } from './chart.component';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'line-chart',
    template: ``
})

export class LineChartComponent implements OnChanges {
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

    constructor(private chart: ChartComponent) {}

    ngOnChanges() {
        this.chart.removeAllElement();
    }
}