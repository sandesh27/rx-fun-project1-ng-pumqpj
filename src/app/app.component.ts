import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <label for="range">
        Number
        <input
          name="range"
          type="range"
          #range
          min="1"
          max="100"
          step="1"
          value="10"
          (input)="rangeChanged(range.value)"
        />
        <span class="range-value">{{ value }}</span>
      </label>
    </div>
    <div>
      Doubled Value:
      <span class="doubled-value">{{ doubleValue }}</span>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  rangeObserver;
  rangeObs;
  doubleValueObs;
  value;
  doubleValue;
  valueSub;
  doubleValueSub;

  ngOnInit() {
    this.rangeObs = new Observable(observer => {
      this.rangeObserver = observer;
    }).pipe(
      startWith(20),
      shareReplay(1)
    );
    this.doubleValueObs = this.rangeObs;

    this.valueSub = this.rangeObs.subscribe(val => {
      this.value = val;
    });

    this.doubleValueSub = this.doubleValueObs.subscribe(val => {
      this.doubleValue = val * 2;
    });
  }
  rangeChanged(value) {
    this.rangeObserver.next(value);
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    this.doubleValueSub.unsubscribe();
  }
}
