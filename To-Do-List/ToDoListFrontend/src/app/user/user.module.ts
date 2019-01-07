import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Importing toastor
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserListComponent } from './user-list/user-list.component';
import { TaskListComponent } from './task-list/task-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';





@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotComponent, ResetComponent, UserListComponent, TaskListComponent],
  imports: [
    CommonModule,
    ToastrModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'sign-up', component: SignupComponent },
      { path: 'forgot', component: ForgotComponent },
      { path: 'userlist/:userId', component: UserListComponent },
      { path: `reset/:resetToken`, component: ResetComponent },
      { path: `taskList/:listId/:listName`, component: TaskListComponent },
    ])
  ]
})
export class UserModule { }
