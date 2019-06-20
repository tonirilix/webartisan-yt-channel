import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { retryWhen, tap, delay } from 'rxjs/operators';
import { MinersService } from './miners.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rxjs-websockets-d3';
  serverData;
  conectionStatus = false;
  private socketSubscription: Subscription;

  constructor(private minersService: MinersService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    const delayTime = 6000;
    this.socketSubscription = this.minersService.getMiners$('http://localhost:3000')
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(err => {
              console.error('Got error', err);
            }),
            delay(delayTime),
          )
        )
      )
      .subscribe((latestStatus: any) => {
        this.serverData = latestStatus;
      }, err => {
        console.log('No more data');
        console.error(err);
      });
  }

  toggle() {
    if (this.socketSubscription && !this.socketSubscription.closed) {
      return this.socketSubscription.unsubscribe();
    }
    this.init();
  }
}
