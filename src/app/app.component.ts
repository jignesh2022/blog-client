import { Component } from '@angular/core';
import {Router,NavigationStart,NavigationEnd, Event } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'techBlog';
  constructor(private router:Router){     
  }
  ngOnInit(){
    window.addEventListener("keyup", disableF5);
    window.addEventListener("keydown", disableF5);
    
    window.addEventListener("beforeunload",confirmExit); 

    function confirmExit(e:any)
    {
      alert();
      e.preventDefault();
      return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
    }

    function disableF5(e:any) {
        if ((e.which || e.keyCode) == 116) e.preventDefault(); 
    };
    

    this.router.navigate(['/home']);
  }
    
}
