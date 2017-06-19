import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChartComponent } from './chart/chart.component';
import { BarChartComponent } from './chart/bar.component';
import { LineChartComponent } from './chart/line.component'
console.log('`Common` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    ChartComponent,
    BarChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ChartComponent,
    BarChartComponent,
    LineChartComponent
  ]
})
export class OurCommonModule { }
