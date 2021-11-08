import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UpdateBlogComponent} from './update-blog/update-blog.component';
import {MyBlogsComponent} from './my-blogs/my-blogs.component';
import { AuthGuard } from './shared/auth.guard';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path:"login",
    component: LoginComponent
  },
  {
    path:"register",
    component: RegisterComponent
  },
  {
    path:"create-blog",
    component: CreateBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"update-blog/:blogid",
    component: UpdateBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"my-blogs",
    component:MyBlogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"view-blog/:blogid",
    component:ViewBlogComponent
  },
  {
    path:"home",
    component:HomeComponent
  }
];
//https://github.com/angular/angular/issues/29828
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
