import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { retryWhen, tap, delay } from 'rxjs/operators';
import * as socketio from 'socket.io-client';

const createWebSocket = uri => {
  return new Observable(observer => {
    try {
      const subject = webSocket(uri);

      const socket = socketio(uri);

      socket.on('connect', () => {
        console.log('WS: Connected', socket.id);
      });

      socket.on('connect_error', (error) => {
        console.log('WS: Connect error');
        // observer.error(error);
      });

      socket.on('message', (marketStatus) => {
        observer.next(marketStatus);
      });

      socket.on('disconnect', () => {
        console.log('WS: Disconnected!');
        // observer.complete();
      });

      socket.on('error', (error) => {
        console.log('WS: Error!');
        observer.error(error);
      });

      // const handler = setInterval(() => {
      //   subject.next('WS: ');
      // }, 1000);

      // const subscription = subject.asObservable()
      //   .subscribe(data => {
      //     observer.next(data);
      //   },
      //     error => observer.error(error),
      //     () => observer.complete());

      return () => {
        // clearInterval(handler);
        // if (!subscription.closed) {
        //   subscription.unsubscribe();
        // }
      };
    } catch (error) {
      observer.error(error);
    }
  });
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rxjs-websockets-d3';
  marketStatusToPlot: any[] = [];

  ngOnInit(): void {
    createWebSocket('http://localhost:3000')
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(err => {
              console.error('Got error', err);
            }),
            delay(1000)
          )
        )
      )
      .subscribe(latestStatus => {
        console.log(latestStatus);
        this.marketStatusToPlot = [latestStatus].concat(this.marketStatusToPlot); // 3
      }, err => console.error(err));
  }
}
