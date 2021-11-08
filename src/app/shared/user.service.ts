import { Injectable, OnInit } from '@angular/core';
import { IUser } from './user';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

//https://dev.to/imben1109/date-handling-in-angular-application-part-2-angular-http-client-and-ngx-datepicker-3fna
//https://www.positronx.io/angular-service-tutorial-with-example/
@Injectable({
  providedIn: 'root'
})
export class UserService{

  apiUrl: string = 'http://localhost:3000/api/v1';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } ;
  
  //private userobj = new Subject<IUser|null>();
  private userobj = new BehaviorSubject<IUser|null>(null);
  private token = new Subject<string>();

  loggedInUser:boolean=false;  
  directToken:string|null=null;

  constructor(private http: HttpClient) {} 
 
  getToken():Observable<string>{
      return this.token;
  }

  getTokenDirectly():string|null{
    return this.directToken;
  }

  setToken(token?:string):void{
    if(token != null)
    {
      this.token.next(token);
    }
    else
    {
      this.token.next();
    }
  }
  
  login(data:object):Observable<IUser|any|null>{
    let API_URL = `${this.apiUrl}/login`;

    return this.http.
              post(API_URL, JSON.stringify(data), this.httpHeader);              
              
  }

  public getUser():Observable<IUser|null>{     
    
    return this.userobj.asObservable();    
  }
  

  public setUser(obj?:IUser):void{
    if(obj != null)
    {
      this.userobj.next(obj);
    }
    else
    {
      this.loggedInUser=false;
      //this.userobj.next();
      this.userobj.next(null);
    }
  }

  emailExists(data:object):Observable<any>
  {
    let API_URL = `${this.apiUrl}/checkifuserexists`;
    //let exists:boolean = false;
    return this.http
      .post(API_URL, JSON.stringify(data), this.httpHeader)
      
      
  }

  register(data:object):Observable<any>{
    let API_URL = `${this.apiUrl}/register`;
    //let status:any|null=null;
    return this.http
      .post(API_URL, JSON.stringify(data), this.httpHeader);
      
        
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
