import { Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {Router} from '@angular/router'
import {take,map, delay} from 'rxjs/operators';
import {IBlog} from '../shared/blog';
import {BlogService} from '../shared/blog.service';
import { IUser } from '../shared/user';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import {AlertService} from '../shared/alert.service';
import { MessageType } from '../shared/message';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.css']
})
export class MyBlogsComponent implements OnInit {

  constructor(private userservice:UserService,
          private router:Router, 
          private blogservice:BlogService,
          private alertService:AlertService) {         
  }
  sub1:Subscription|null=null;
  sub2:Subscription|null=null;
  sub3:Subscription|null=null;
  blogs:IBlog[]|null=null;
  userobj:any=null;
  token:string|null=null;
  
  nextPageNum:number|null=null;
  previousPageNum:number|null=null;
  showNextPage:boolean=false; 
  showPrevPage:Boolean=false;
  
  ngOnInit() {
    //this.getUser();
    this.populateBlogs(1);
      //console.log(this.blogs)
  }  

  ngAfterContentInit(){
    
  }
  private getUser()
  {
    this.sub1 = this.userservice.getUser().subscribe(
      (result)=>{
        if(!result)
        {
          console.log("no user found")
        }
        console.log("MY BLOGS userobj ",result);
        //this.userobj = result;
      }
    );
  }

  ngOnDestroy(){
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
    this.sub3?.unsubscribe();
  }

  nextPageClicked(){
    this.populateBlogs(this.nextPageNum);
  }

  previousPageClicked(){    
    this.populateBlogs(this.previousPageNum);
  }

  private populateBlogs(pagenum:number|null)   
  {    
    this.sub2 = this.blogservice.getBlogsByUserId(pagenum)   
    .pipe(        
      map((result)=>{
        
        result.docs.map((rec:any)=> {
          rec.id=rec._id;
          rec.updatedAt=moment(rec.updatedAt).format("LLL"); 
          delete rec._id;
        });
        return result;
      })    
    )
    .subscribe(
      {next:(result)=>{             
        this.previousPageNum = result.prevPage;
        this.nextPageNum = result.nextPage;    

        this.showPrevPage = result.hasPrevPage;
        this.showNextPage = result.hasNextPage;      
        
        this.blogs=result.docs;

        //console.log(result)
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
    }
    );
 
    
  }

  deleteBlog(id:string){
    if(confirm("Do you want to delete this blog?"))
    {
      //console.log("Deleted ",id);
      this.sub3 = this.blogservice.deleteBlog({"blogid":id})
        .subscribe(
        {
          next:(result:any)=>{
            //alert(result.message);
            if(result)
            {
              this.alertService.setMessage({
                messageType:MessageType.SUCCESS,
                message:"Blog deleted"
              })
              //this.router.navigate(['/my-blogs']);
              this.ngOnInit();
          }
          },         
          error:(error:any)=>{ 
            if(error.status == 403)
            {
              this.userservice.setUser();
              this.router.navigate(["/login"]);
            }
          }
      });
    }
  }

}
