import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService} from '../shared/user.service';
import {take} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IUser } from '../shared/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  sub:Subscription|null=null;
  userobj:IUser|null=null;
  
  constructor(private userservice:UserService,
    private router:Router) { }

  ngOnInit(): void {
    //console.log("FROM HEADER",this.userservice.getUserObject())
    this.sub = this.userservice.getUser().subscribe(
      (result)=>{
      this.userobj = result;
      } 
    );
    
  }

  logout(){
    this.userservice.setUser(); 
    this.router.navigate(["/home"]);
  }

  ngOnDestroy():void{
    this.sub?.unsubscribe();
  }
}
