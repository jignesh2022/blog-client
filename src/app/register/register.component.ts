import { Component, ElementRef, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../shared/user.service';
import {BlogService} from '../shared/blog.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  registerForm:any;
  emailExists:boolean=false;  
  showAlert:boolean=false;
  alertMessage:any;
  showModal:boolean=true;
  sub:Subscription|null=null;
  @ViewChild('firstRef') firstRef:ElementRef|null=null;

  constructor(private user:UserService, 
    private router:Router,
    private formBuilder:FormBuilder) { }

  ngOnInit(): void { 
    this.registerForm = this.formBuilder.group({
      firstName:[null,[Validators.required]],
      lastName:[null,[Validators.required]],
      email: [null,[Validators.required, Validators.email]],
      password: [null,[Validators.required, Validators.minLength(8)]],
      confirmPassword:[null,[Validators.required, Validators.minLength(8)]]
    });
  }

  ngAfterViewInit(){
    this.firstRef?.nativeElement.focus();
  }

  register(){
    //console.log(this.getControl.password.value);
    //console.log(this.getControl.confirmPassword.value);
    if(this.getControl.password.value != this.getControl.confirmPassword.value)
    {
          this.showAlert = true;          
          this.alertMessage = "Password and confirm password must match.";
          return;
    }
    else
    {
          this.showAlert = false;          
          this.alertMessage = "";
    }
     
    const userToBeRegistered = this.registerForm.value;
     
    delete userToBeRegistered["confirmPassword"];
     //console.log(userToBeRegistered);
     
    this.sub = this.user.register(userToBeRegistered)
      .subscribe((result) =>
      {
        if(result.message == "New User created.")
        {
          this.registerForm.reset();
          alert("New User created.")
          this.router.navigate(['/login']);
        }
      });
      
  }

  checkIfEmailExists(event:any){    
    
    //alert(event.target.value)
    this.sub = this.user.emailExists({email:event.target.value})
      .subscribe(
        (result)=>{
          if(result.message == "This user already exists.")
          {            
            this.showAlert = true;          
            this.alertMessage = "Email already exists";   
            this.registerForm.reset();            
            
                    
          } 
          else{
            this.showAlert = false;            
            this.alertMessage = "";
          }
        }
      );
    
    
      
    
  }

  get getControl(){
    return this.registerForm.controls;
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }

}
