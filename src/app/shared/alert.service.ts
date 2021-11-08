import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {IMessage, MessageType} from '../shared/message';
@Injectable({
  providedIn: 'root'
})
export class AlertService { 
  private alertMessage = new BehaviorSubject<IMessage|null>(null);
  
  constructor() { }

  setMessage(msg?:IMessage){
    if(msg)
    {
      this.alertMessage.next(msg);
    }
    else
    {
      this.alertMessage.next(null);        
    }
  }

  getMessage():Observable<IMessage|null>{
    return this.alertMessage;
  }

  
}


