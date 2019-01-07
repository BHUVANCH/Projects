import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList;

  constructor(public http: AppService, public route: Router, public toastr: ToastrService) { }

  ngOnInit() {

    this.checkStatus();
    // console.log(Cookie.getAll());
    this.http.userList().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // tslint:disable-next-line:prefer-const
        this.userList = apiResponse.data;
        // console.log(this.userList);

      } else {
        console.log('error occured while logging in');
        this.toastr.error(apiResponse.message);
        this.route.navigate(['/login']);
      }
    }, (err) => {
      this.toastr.error('some error occurred');
    });
  }

  public checkStatus: any = () => {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      this.route.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

  public logout: any = () => {
    this.http.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log('logout called');
        // console.log(apiResponse);
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        this.route.navigate(['/']);
      } else {
        this.toastr.error(apiResponse.message);
      } // end of condition
    }, (err) => {
      this.toastr.error('Some error occured');
    });
  }

  public userSelected: any = (userId, email) => {
    // console.log(userId);
    // console.log(email);
    Cookie.set('userId', userId);
    Cookie.set('useremail', email);
    this.route.navigate([`/admin-cal/${userId}`]);
  }

}
