import { Component, OnInit } from '@angular/core';
import { NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { IBlog } from '../shared/blog';
import {BlogService} from '../shared/blog.service';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {

  constructor(private activatedRoute:ActivatedRoute,
    private blogservice:BlogService) { }
  
  blog:IBlog|any;

  ngOnInit(): void {
    this.blogservice.
      getSingleBlog(this.activatedRoute.snapshot.params.blogid)
      .pipe(        
        map((result)=>{
                    
            result.id= result._id;
            result.updatedAt=moment(result.updatedAt).format("LLL"); 
            delete result._id;
          
          return result;
        })    
      )
      .subscribe(
        (result)=>{
          //console.log(result);
          this.blog = result;
          
        }
      )
  }

}
