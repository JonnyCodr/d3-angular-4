import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [
    Title
  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./home.component.css'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = { value: '' };
  /**
   * TypeScript public modifiers
   */
  constructor(
    public appState: AppState,
    public title: Title
  ) { }

  public ngOnInit() {
    console.log('hello `Home` component');
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

  data: any = {
    name: null,
    val: null
  };
  chart: any = [{ name: 'January', val: 10 }, { name: 'February', val: 20 }, { name: 'March', val: 100 }];
  error: any = null;
  width: any = 500;
  height: any = 250;
  dimension: any = {
    width: this.width,
    height: this.height
  }

  onAdd() {
    if (this.data.val > 0) {
      const data = Object.assign({}, this.data, {
        val: parseInt(this.data.val)
      })
      this.chart = this.chart.concat(data)
      this.error = null;
      this.data = {
        name: null,
        val: null
      };
    } else {
      this.error = 'Zero is not allowed';
    }
  }

  onKeyUp(event) {
    if (event.key == 'Enter') {
      this.onAdd();
    } else if (parseInt(event.key) == NaN) {
      this.error = "Please just input number";
    } else {
      this.error = null;
    }
  }

  reset() {
    this.chart = new Array();
    this.data = null;
    this.error = null;
  }

  changeSize() {
    this.dimension = Object.assign({}, {
      width: parseInt(this.width),
      height: parseInt(this.height)
    });
  }
}
