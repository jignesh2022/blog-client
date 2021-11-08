import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {UserService} from '../shared/user.service';
import {Router} from '@angular/router'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { IUser } from '../shared/user';
import { HeaderComponent } from '../header/header.component';
import { Subscription } from 'rxjs';
import jwt_decode from 'jwt-decode';
        
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  sub:Subscription|null=null;
  loginForm:any;
  @ViewChild('emailRef') emailRef:ElementRef|null=null;
  constructor(private user:UserService, 
      private router:Router,
      private formBuilder:FormBuilder) { 
        
      }

  alertMessage:any;
  showAlert:boolean=false;
  
  ngOnInit(): void {
   

    this.loginForm = this.formBuilder.group({
      email: [null,[Validators.required]],
      password: [null,[Validators.required]]
    });
  }

  ngAfterViewInit(){
    this.emailRef?.nativeElement.focus();
  }

  

  login(){
        
    this.sub = this.user.login(this.loginForm.value)
              .subscribe(      
      (result) => {
              if(result.message != "found")
              {
                this.alertMessage = result.message;
                this.showAlert = true;    
                this.loginForm.reset();
              }
              //console.log(result.accessToken)  
              this.user.setToken(result.accessToken);
              this.user.directToken = result.accessToken;
              //console.log(this.token);
              const tempuser:any = jwt_decode(result.accessToken);
              
              //console.log(tempuser);
              const user:IUser={              
                id: tempuser.id,
                name: tempuser.name,
                iat: tempuser.iat,
                exp: tempuser.exp
              };
              
              this.user.setUser(user);                  
              this.user.loggedInUser = true;

              this.router.navigate(['/my-blogs'])
            }
      );       

  }

  get getControl(){
    return this.loginForm.controls;
  }

  ngOnDestroy():void{
    this.sub?.unsubscribe();
  }
}
