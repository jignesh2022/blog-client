import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, Subscription, throwError } from 'rxjs';
import {catchError, map,take,first} from 'rxjs/operators';
import { IUser } from './user';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  loggedIn:boolean=false;
  constructor(private userservice:UserService,private router:Router)
  {     
    
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        :Observable<boolean>|Promise<boolean>|boolean{     
    
    if(!this.userservice.loggedInUser)
    {
      this.router.navigate(['/login']);
      return false;
    }
    else
    {
      return true;
    }
    
  
    
  } 
    
  
  
}
