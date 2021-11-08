import { AfterViewInit, Renderer2, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBlog } from '../shared/blog';
import { BlogService } from '../shared/blog.service';
import { UserService } from '../shared/user.service';
import { MessageType } from '../shared/message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userservice:UserService,
    private router:Router, 
    private blogservice:BlogService) {         
  }
  
  sub1:Subscription|null=null;
  sub2:Subscription|null=null;
  blogs:IBlog[]|null=null;
  userobj:any=null;
  token:string|null=null;
    
  nextPageNum:number|null=null;
  previousPageNum:number|null=null;
  showNextPage:boolean=false; 
  showPrevPage:Boolean=false;
  searchTerm:string="";
   
  
  ngOnInit() {
    /*this.sub2 = this.userservice.getUser().subscribe(
      (result)=>{
        console.log("HOME PAGE",result);
      }
    );*/

    this.populateBlogs(1,this.searchTerm);
      //console.log(this.blogs)   
  }  
  

  ngOnDestroy(){
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
  }

  nextPageClicked(){
    this.populateBlogs(this.nextPageNum,this.searchTerm);
  }

  previousPageClicked(){    
    this.populateBlogs(this.previousPageNum,this.searchTerm);
  }

  private populateBlogs(pagenum:number|null,searchTerm:string)   
  {    
    this.sub2 = this.blogservice.getBlogs(pagenum,searchTerm)   
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
      (result)=>{     
        
        this.previousPageNum = result.prevPage;
        this.nextPageNum = result.nextPage;    

        this.showPrevPage = result.hasPrevPage;
        this.showNextPage = result.hasNextPage;      
        if(result.docs.length > 0)
        {
          this.blogs=result.docs;
        }
        else
        {
          this.blogs = null;
        }
        //console.log(result)
      }        
    );

    
  }

  search(evt:any){
    this.blogs = null;
    this.searchTerm = evt.target.value;
    this.populateBlogs(1,this.searchTerm);

  }

}
