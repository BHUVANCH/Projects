import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: any;
  public password: any;
  constructor(public route: Router, public http: AppService, public toastr: ToastrService) { }
  ngOnInit() {
  }
  public goToSignUp: any = () => {
    this.route.navigate(['/sign-up']);
  }

  public forgotPassword: any = () => {
    this.route.navigate(['/forgot']);
  }

  public signinFunction: any = () => {
    if (!this.email) {
      this.toastr.warning('enter the email');
    } else if (!this.password) {
      this.toastr.warning('enter the password');
    } else {
      // tslint:disable-next-line:prefer-const
      let data = {
        email: this.email,
        password: this.password
      };
      // console.log(data);
      this.http.signinFunction(data).subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          // console.log(apiResponse);
          this.toastr.success('Login Sucessuful');
          // console.log(apiResponse.data.authToken);
          Cookie.set('authToken', apiResponse.data.authToken);
          // console.log(apiResponse.data.userDetails.email);
          Cookie.set('receiverEmail', apiResponse.data.userDetails.email);
          // console.log(apiResponse.data.userDetails.firstName);
          Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          // console.log(apiResponse.data.userDetails.userId);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          // console.log(Cookie.getAll());
          this.http.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          // if (apiResponse.data.userDetails.userType === 'Admin' || apiResponse.data.userDetails.userType === 'admin') {
            this.route.navigate([`/userlist/${apiResponse.data.userDetails.userId}`]);
          // } else {
          //   this.route.navigate([`/user-cal/${apiResponse.data.userDetails.userId}`]);
          // }
        } else {
          console.log('error occured while logging in');
          this.toastr.error(apiResponse.message);
          setTimeout(() => {
            this.goToSignUp();
          }, 2000);
        }
      }, (err) => {
        this.toastr.error('some error occurred');
      });
    }
  }
}
