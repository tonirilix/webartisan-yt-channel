import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import * as socketio from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class MinersService {

  constructor() { }

  public getMiners$(uri) {
    return new Observable(observer => {
      try {
        const minerSocket = webSocket(uri);
        minerSocket.subscribe((d) =>
          console.log(':::webSocket Miner arrived'),
          (err) => console.warn(':::webSocket Miner DIDNOT arrived'),
          () => console.log(':::webSocket COMPLETED')
      );

        const socket = socketio(uri);

        socket.on('connect', () => {
          console.log('WS: Connected', socket.id);
        });

        socket.on('message', ( minerLastValue ) => {
          console.log('WS: Message');
          observer.next( minerLastValue );
        });

        socket.on('disconnect', () => {
          console.warn('WS: Disconnected!');
          // observer.complete();
        });

        socket.on('error', (error) => {
          console.log('WS: Error!');
          observer.error(error);
        });

        socket.on('connect_error', (error) => {
          console.log('WS: Connect error');
          observer.error(error);
        });

        return () => {
          console.log('Observable completed!');
          socket.disconnect();
        };

      } catch (error) {
        observer.error(error);
      }
    });
  }
}
