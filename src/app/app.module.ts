import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { MyBlogsComponent } from './my-blogs/my-blogs.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { UpdateBlogComponent } from './update-blog/update-blog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {AuthGuard} from './shared/auth.guard';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { HomeComponent } from './home/home.component';
import { AlertComponent } from './alert/alert.component'
import { UserService } from './shared/user.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    MyBlogsComponent,
    CreateBlogComponent,
    UpdateBlogComponent,
    ViewBlogComponent,
    HomeComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularEditorModule
  ],
  providers: [AuthGuard,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
