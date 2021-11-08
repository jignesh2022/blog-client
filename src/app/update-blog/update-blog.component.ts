import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/user.service';
import {BlogService} from '../shared/blog.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {AlertService} from '../shared/alert.service';
import { MessageType } from '../shared/message';
import { Subscription } from 'rxjs';
import { IUser } from '../shared/user';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.css']
})
export class UpdateBlogComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute,
    private router:Router,
    private userservice:UserService,
    private formBuilder:FormBuilder,
    private blogservice:BlogService,
    private alertService:AlertService) { }
    
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

  ngOnInit(): void {

    this.sub1 = this.userservice.getUser().subscribe(
      {

          next:(result)=>{ 
              if(result)
              {
                //console.log(result);
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
    //console.log(this.activatedRoute.snapshot.params.blogid);
    this.blogservice.getBlogToBeUpdated({
      "blogid": this.activatedRoute.snapshot.params.blogid
    }).subscribe(
      (result)=>{
        //console.log(result);
        this.blogForm.setValue({
          title:result.title,
          summary:result.summary,
          body:result.body
        });        
      }
    );

    
    
    
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

onSubmit() {
  //console.log( `Form submit, model: ${ JSON.stringify( this.html ) }` );
  const blogToBeUpdated = this.blogForm.value;
  blogToBeUpdated["blogid"] =  this.activatedRoute.snapshot.params.blogid;      
  blogToBeUpdated["createdBy"]  = this.userobj?.name;
  this.sub2 = this.blogservice.updateBlog(blogToBeUpdated)
    .subscribe(      
        {next:(result)=>{
          //console.log(result);
          this.alertService.setMessage({
            messageType:MessageType.SUCCESS,
            message:"Blog updated."
          }) 
          this.router.navigate(['/my-blogs']);
          
        },
        error:(error)=>{
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
          }
        }
      });
}

get getControl(){
return this.blogForm.controls;
}

ngOnDestroy(): void {     
  this.sub1?.unsubscribe();
  this.sub2?.unsubscribe();
}

}
