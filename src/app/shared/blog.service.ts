import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError, Subject, pipe, concat } from 'rxjs';
import { catchError, concatMap, first, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {UserService} from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  apiUrl: string = 'http://localhost:3000/api/v1';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } ;
  token:string|any=null;
  constructor(private user:UserService,
        private http:HttpClient) { 
          /*this.user.getToken().subscribe(
            (result)=>{
              //console.log(result)
              this.token = result;
            }
          )*/
        }

  getBlogsByUserId(pagenum:number|null):Observable<any> 
  {
    if(pagenum == null)
    {
      pagenum = 1;
    }
    let API_URL = `${this.apiUrl}/get-user-blogs`;
    return this.http.post(API_URL,
      JSON.stringify({token:this.user.directToken,pagenum:pagenum,numOfRecords:5}), 
      this.httpHeader);    
     
  }

  getBlogs(pagenum:number|null,searchTerm:string):Observable<any> 
  {
    if(pagenum == null)
    {
      pagenum = 1;
    }
    let API_URL = `${this.apiUrl}/get-blogs`;
    return this.http.post(API_URL,
      JSON.stringify({token:this.user.directToken,pagenum:pagenum,numOfRecords:5,searchTerm:searchTerm}), 
      this.httpHeader);    
     
  }
  

  getSingleBlog(blogid:string):Observable<any>
  {
    let API_URL = `${this.apiUrl}/blog/${blogid}`;
    return this.http.get(API_URL, this.httpHeader);
          
  }

  getBlogToBeUpdated(data:any):Observable<any>
  {
    data["token"] = this.user.directToken;
    let API_URL = `${this.apiUrl}/blogToBeUpdated`;
    return this.http.post(API_URL,JSON.stringify(data), this.httpHeader);
          
  }

  createBlog(data:any):Observable<any>
  {    
    let API_URL = `${this.apiUrl}/create-blog`;
    //console.log("DATA POSTED ",data)
    if(this.user.directToken != null)
    {
      data["token"] = this.user.directToken;
      return this.http.
        post(API_URL,JSON.stringify(data), this.httpHeader);
            
    }
    else
    {
      const msg:any = {message:"Token missing"};
      return msg;
    }
  }

  updateBlog(data:any):Observable<any>
  {
    
    let API_URL = `${this.apiUrl}/update-blog`;
    if(this.user.directToken != null)
    {
      data["token"] = this.user.directToken;
      return this.http.put(API_URL,JSON.stringify(data), this.httpHeader);
            
    }
    else
    {
      const msg:any = {message:"Token missing"};
      return msg;
    }
  }

  deleteBlog(data:any)
  {
    //this.token = this.user.getToken();
    let API_URL = `${this.apiUrl}/delete-blog/${data.blogid}`;
    if(this.user.directToken != null)
    {
      data["token"] = this.user.directToken;
      return this.http.
        post(API_URL,JSON.stringify(data),this.httpHeader);
            
    }
    else
    {
      const msg:any = {message:"Token missing"};
      return msg;
    }
  }

  // Handle Errors 
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
