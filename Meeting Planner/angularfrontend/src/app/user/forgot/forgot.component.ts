import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';


// Importing toastr
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  public email: any;
  constructor(public toastr: ToastrService, public app: AppService, public route: Router) { }
  public resetPassword: any = () => {
    if (!this.email) {
      this.toastr.warning('enter the email');
    } else {
      // console.log(this.email);
      // tslint:disable-next-line:prefer-const
      let data = {
        email: this.email
      };
      // console.log(data);
      this.app.forgotPassword(data).subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          // console.log(apiResponse);
          // console.log(apiResponse.data.email);
          // console.log(apiResponse.data.token);
          Cookie.set('resetemail', apiResponse.data.email);
          Cookie.set('resetToken', apiResponse.data.token);
          this.route.navigate(['login']);
        } else {
          console.log('error occured in Forgot Password');
          this.toastr.error(apiResponse.message);
          setTimeout(() => {
            this.toastr.warning('enter valid email');
          }, 2000);
        }
      }, (err) => {
        this.toastr.error('some error occurred');
      });

    }
  }

  ngOnInit() {
  }


}

