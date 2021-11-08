import { Component, OnDestroy, OnInit } from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor'
import {FormsModule} from '@angular/forms';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserService} from '../shared/user.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BlogService } from '../shared/blog.service';
import { IUser } from '../shared/user';
import {AlertService} from '../shared/alert.service';
import { MessageType } from '../shared/message';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit, OnDestroy {
  

  blogForm:any;
  emailExists:boolean=false;  
  showAlert:boolean=false;
  alertMessage:any;
  showModal:boolean=true;
  html:string = '';
  editor:any;
  userobj:IUser|null=null;
  sub1:Subscription|null=null;
  sub2:Subscription|null=null;
  
  constructor(private userservice:UserService, 
    private router:Router,
    private formBuilder:FormBuilder,
    private blog:BlogService,
    private alertService:AlertService) {   
      
    }  
    
  ngOnInit(): void {   
    this.sub1 = this.userservice.getUser().subscribe(
      {

          next:(result)=>{ 
              if(result)
              {
                console.log(result);
                this.userobj = result;
              }
          },
          error:(error)=>{
            alert(error);
          }
      }
    )        
   
    this.blogForm = this.formBuilder.group({
      title:[null,[Validators.required,Validators.maxLength(300)]],
      summary:[null,[Validators.required,Validators.maxLength(200)]],
      body: [null,[Validators.required]]
      
    });
    
    
  }
  

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    //uploadUrl: 'G:\\reebroker',
    //upload: (file: File) => { console.log(file);},
    //uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  ngOnDestroy(): void {     
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
  }

  
  
  onSubmit() {
      //console.log( `Form submit, model: ${ JSON.stringify( this.html ) }` );
      const blogToBeCreated = this.blogForm.value;  
      blogToBeCreated["createdBy"]  = this.userobj?.name;
      //console.log(blogToBeCreated);
      //return;
      this.sub2 = this.blog.createBlog(blogToBeCreated)
        .subscribe(
            {
            next:(result)=>{
              //alert(result.message);
              if(result.message == "Blog created successfully")
              {
                this.alertService.setMessage({
                  messageType:MessageType.SUCCESS,
                  message:"New Blog created."
                });              
              
                this.router.navigate(['/my-blogs']);
              } 
            }
          ,
          error:(error) => {
          if(error.status == 403)
          {
            this.userservice.setUser();
            this.alertService.setMessage(
                {
                  messageType:MessageType.ERROR,
                  message:"Session expired, please login again."
                }
              ); 
            this.router.navigate(["/login"]);
          }}
        });
  }

  get getControl(){
    return this.blogForm.controls;
  }
}
