import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList = [{
    listId: 'id',
    listName: 'listname',
  }];
  public listname: string[];
  public newList;
  public inviteshare: any;
  public listId: string;
  public listName: string;
  public ilistId: string;
  public ilistName: string;
  public userEmail = Cookie.get('receiverEmail');

  constructor(public http: AppService,
    public route: Router,
    public toastr: ToastrService,
    public _router: ActivatedRoute,
    public socket: SocketService,
  ) { }

  ngOnInit() {
    this.userList.shift();
    // tslint:disable-next-line:prefer-const
    let data = {
      userId: this._router.snapshot.paramMap.get('userId'),
      useremail: Cookie.get('receiverEmail'),
    };
    this.checkStatus();
    this.getMessageFromAUser();
    // console.log(Cookie.getAll());
    this.http.getUserLists(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        if (apiResponse.data === null) {
          this.toastr.error('list is Empty');
        } else {
          // tslint:disable-next-line:prefer-const
          let filtered = apiResponse.data.listdetails.filter(function (a) {
            if (!this[a.listId]) {
              this[a.listId] = true;
              return true;
            }
          }, Object.create(null));

          // console.log(filtered);
          this.userList = filtered;
        }
        // console.log(this.userList);
      } else {
        // console.log('error occured while logging in');
        this.toastr.error(apiResponse.message);
        this.route.navigate(['/login']);
      }
    }, (err) => {
      this.toastr.error('some error occurred');
    });

  }

  // subscribing to your own ID to get the messages
  public getMessageFromAUser = () => {
    this.socket.ByUserEmail(this.userEmail).subscribe((data) => {
      // console.log(data);
      if (data.message === 'shareList') {
        this.openModal();
        this.inviteshare = data.userEmail;
        this.ilistId = data.listId;
        this.ilistName = data.listName;
      }
    }); // end of subscribe
  } // end get message from user

  // subscribing to your own ID to get the messages
  public updateuser = (update) => {
    // console.log(update);
    this.http.updateUser(update).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        this.toastr.success(apiResponse.message);
        this.ngOnInit();
      } else {
        // console.log('error occured in update user');
        this.toastr.error(apiResponse.message);
      }
    }, (err) => {
      this.toastr.error('some error occurred');
    });
  } // end get message from user

  public accept = (responseEmail) => {
    // console.log(responseEmail);
    // console.log('Accepted');
    // tslint:disable-next-line:prefer-const
    let shareobj = {
      userEmail: Cookie.get('receiverEmail'),
      message: 'Accepted',
      shareEmail: responseEmail,
      listId: this.ilistId,
      listName: this.ilistName,
    };
    // console.log(shareobj);
    this.socket.shareList(shareobj);
    setTimeout(() => {
      this.ngOnInit();
    }, 1500);
  }

  public openModal() {
    // console.log('Open Modal');
    // tslint:disable-next-line:prefer-const
    let element: HTMLElement = document.getElementById('dynamic') as HTMLElement;
    element.click();
  }

  public addList: any = () => {
    // tslint:disable-next-line:prefer-const

    this.newList = {
      listId: UUID.UUID(),
      listName: this.listname,
    };
    this.userList.push(this.newList);
  }

  public saveChanges: any = () => {
    // tslint:disable-next-line:prefer-const
    let data = {
      userId: this._router.snapshot.paramMap.get('userId'),
      userEmail: Cookie.get('receiverEmail'),
      listdetails: this.userList
    };

    this.http.saveList(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        // tslint:disable-next-line:prefer-const
        // this.userList = apiResponse.data;
        // console.log(this.userList);

      } else {
        // console.log('error occured while logging in');
        this.toastr.error(apiResponse.message);
      }
    }, (err) => {
      this.toastr.error('some error occurred');
    });
    // console.log(this.userList);
  }


  public listSelected: any = (listId, listName) => {
    // console.log(listId);
    // console.log(listName);
    Cookie.set('listId', listId);
    Cookie.set('listName', listName);
    this.route.navigate([`/taskList/${listId}/${listName}`]);
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


}
