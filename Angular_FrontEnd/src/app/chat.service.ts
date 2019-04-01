import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://192.168.1.74:3000';
  private socket;
  constructor() { 
    this.socket = io(this.url);
  }
  public sendMessage(data) {
    this.socket.emit('new-message', data);
  } 
  public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new-message', (message) => {
            observer.next(message);
        });
    });
  }
}
