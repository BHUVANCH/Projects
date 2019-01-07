import { Component, OnInit } from '@angular/core';

// Importing toastr
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  public newPassword: any;
  public confirmPassword: any;
  constructor(public toastr: ToastrService, public http: AppService, public route: Router, private _router: ActivatedRoute) { }
  public updatePassword: any = () => {
    if (!this.newPassword) {
      this.toastr.warning('enter the new Password');
    } else if (!this.confirmPassword) {
      this.toastr.warning('enter the Confirm Password');
    } else if (this.confirmPassword !== this.newPassword) {
      this.toastr.warning('Password mismatch');
    } else {
      // console.log(this.newPassword);
      // tslint:disable-next-line:prefer-const
      let data = {
        email: Cookie.get('resetemail'),
        password: this.newPassword
      };
      // console.log(data);
      this.http.savePassword(data).subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          // console.log(apiResponse);
          // console.log(apiResponse.data);
          this.route.navigate(['/login']);

        } else {
          console.log('error occured while updating Pasword');
          this.toastr.error(apiResponse.message);
          this.toastr.warning('enter valid email');
        }
      }, (err) => {
        this.toastr.error('some error occurred');
      });
    }
  }
  ngOnInit() {
    console.log(this._router.snapshot.paramMap.get('resetToken'));
    if (Cookie.get('resetToken') !== this._router.snapshot.paramMap.get('resetToken')) {
      console.log(this._router.snapshot.paramMap.get('resetToken'));
      this.route.navigate(['login']);
    }
  }
}
