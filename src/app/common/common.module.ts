import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChartComponent } from './chart/chart.component';

console.log('`Common` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    ChartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
    exports: [
      ChartComponent
    ]
})
export class OurCommonModule {}
