import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AlertService} from '../shared/alert.service';
import {MessageType,IMessage} from '../shared/message';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  msg:string|null=null;
  msgType:string|null=null;
  sub1:Subscription|null=null;
  constructor(private alertService:AlertService) { 
    
  }

  ngOnInit(): void {
    this.sub1= this.alertService.getMessage().subscribe(
      (result)=>{
        if(result)
        {
        if(result.messageType == MessageType.ERROR)
        {
          this.msgType = "ERROR";
          this.msg = result.message;
        }
        else if(result.messageType == MessageType.INFO)
        {
          this.msgType = "INFO";
          this.msg = result.message;
        }
        else if(result.messageType == MessageType.SUCCESS)
        {
          this.msgType = "SUCCESS";
          this.msg = result.message;
        }
        else if(result.messageType == MessageType.WARNING)
        {
          this.msgType = "WARNING";
          this.msg = result.message;
        } 
        else
        {
          this.msgType = null;
          this.msg = null;
        }

        setTimeout(()=>{          
          this.alertService.setMessage();
          this.msgType = null;
          this.msg = null;          
        },10000);
      }
      }
    ) 
  }

  ngOnDestroy(){
    this.sub1?.unsubscribe();
  }

}
