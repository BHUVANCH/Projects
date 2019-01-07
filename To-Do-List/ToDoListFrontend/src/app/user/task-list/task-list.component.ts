import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { startOfDay, subDays } from 'date-fns';
import { CalendarEvent } from 'calendar-utils';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from '@angular/common';


import { HostListener } from '@angular/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {


  public taskList = [{
    taskName: 'Task1',
    remainder: Date,
    description: 'Description',
    done: true,
    innerEvents: [{
      taskName: 'InnerTask1',
      remainder: Date,
      description: 'InnerDescription',
      done: true,
    },
    {
      taskName: 'InnerTask2',
      remainder: Date,
      description: 'InnerDescription',
      done: true,
    }],
  }];

  public taskArray = [[{
    taskName: 'Task1',
    remainder: Date,
    description: 'Description',
    done: true,
    innerEvents: [{
      taskName: 'InnerTask1',
      remainder: Date,
      description: 'InnerDescription',
      done: true,
    },
    {
      taskName: 'InnerTask2',
      remainder: Date,
      description: 'InnerDescription',
      done: true,
    }],
  }],
  ];

  public shared = [{
    userID: 'gtr',
    userEmail: 'nissan@gmail.com',
  }
  ];

  public dateTime: Date;
  public shareEmail: string;
  public userEmail = Cookie.get('receiverEmail');
  public userInfo: any;
  public disconnectedSocket: boolean;
  public userList: any = [];

  constructor(
    private location: Location,
    public route: Router,
    public socket: SocketService,
    // private modal: NgbModal,
    private _router: ActivatedRoute,
    public toastr: ToastrService,
    public http: AppService) { }
  public inviteshare: any;
  public listId: string;
  public listName: string;
  public ilistId: string;
  public ilistName: string;
  public count: number;


  ngOnInit() {
    this.taskList.shift();
    this.shared.shift();
    this.listId = this._router.snapshot.paramMap.get('listId');
    this.listName = this._router.snapshot.paramMap.get('listName');

    // tslint:disable-next-line:prefer-const
    let data = {
      listId: this.listId,
      listName: this.listName,
    };
    // console.log(data);
    this.loadTasks(data);
    this.userInfo = this.http.getUserInfoFromLocalstorage();
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromAUser();
    this.OnlineUserChange();
  }

  // getting the onbline users list
  public OnlineUserChange: any = () => {
    this.socket.OnlineUserChange(this._router.snapshot.paramMap.get('listId')).subscribe((userList) => {
      this.userList = [];
      this.toastr.success('listupdated');
      //  console.log('updated');
      this.ngOnInit();
    });

    // console.log('userList');
  }


  @HostListener('window:keyup.control.z', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    // // this.key = event.key;
    this.undoList();
  }

  public undoList(): void {
    // console.log('start' + this.count);
    this.count = this.count - 1;
    if (this.count >= 0) {
      // console.log('end' + this.count);
      this.taskList = this.taskArray[this.count];
      // $('#here').load('#here');

      this.taskArray.pop();
      // console.log(this.taskArray);
    } else {
      this.toastr.success('Cant Undo from here');
    }
  }


  public loadTasks(data): void {
    this.http.gettaskList(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse.data);
        // this.events = apiResponse.data.listdetails;
        // console.log(apiResponse.data.taskArray.length);
        this.taskArray = apiResponse.data.taskArray;
        this.count = this.taskArray.length - 1;
        this.taskList = apiResponse.data.taskArray[apiResponse.data.taskArray.length - 1];
        this.shared = apiResponse.data.shared;
        this.toastr.success(apiResponse.message);
      } else {
        this.toastr.error(apiResponse.message);
      }
      // End of conditional
    }, (err) => {
      this.toastr.error('some error occurred');
    }
      // end of function
    );
    // end of subscribe
  }

  public addInnerTask(data): void {
    // console.log(data.innerEvents);
    data.innerEvents.push({
      taskName: 'InnerTaskAdded',
      remainder: new Date().toLocaleDateString(),
      description: 'InnerDescriptionAdded',
      done: true,
    });
  }

  public shareTaskList(): void {
    // console.log(this.shareEmail);
    // tslint:disable-next-line:prefer-const
    let shareobj = {
      userEmail: Cookie.get('receiverEmail'),
      message: 'shareList',
      shareEmail: this.shareEmail,
      listId: this.listId,
      listName: this.listName,
    };
    this.socket.shareList(shareobj);
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
        // this.toastr.success(data.message);
      } else if (data.message === 'Accepted') {
        this.toastr.success(data.userEmail + ' Accepted to share List');
        this.shared.push({
          userID: data.userEmail,
          userEmail: data.userEmail,
        });
        //  $('#here').load('#here');
        // console.log(data);
        this.saveChanges();
        this.updateuser(data);
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
    this.socket.shareList(shareobj);
  }

  public addTask(): void {
    this.taskList.push({
      taskName: 'Task1',
      remainder: Date,
      description: 'Description',
      done: true,
      innerEvents: [{
        taskName: 'InnerTask1',
        remainder: Date,
        description: 'InnerDescription',
        done: true,
      },
      {
        taskName: 'InnerTask2',
        remainder: Date,
        description: 'InnerDescription',
        done: true,
      }],
    });
  }


  public saveChanges: any = () => {
    // console.log(this.taskList);
    this.taskArray.push(this.taskList);
    // tslint:disable-next-line:prefer-const
    let data = {
      listId: this._router.snapshot.paramMap.get('listId'),
      listName: this._router.snapshot.paramMap.get('listName'),
      shared: this.shared,
      taskArray: this.taskArray,
    };

    this.socket.notifyChange(this._router.snapshot.paramMap.get('listId'));

    this.http.settaskList(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        this.toastr.success(apiResponse.message);
      } else {
        // console.log('error occured in save events');
        this.toastr.error(apiResponse.message);
      }
    }, (err) => {
      this.toastr.error('some error occurred');
    });
    // console.log(data);
  }




  public openModal() {
    // console.log('Open Modal');
    // tslint:disable-next-line:prefer-const
    let element: HTMLElement = document.getElementById('dynamic') as HTMLElement;
    element.click();
  }

  public goBackToPreviousPage() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  // weather user is online or not
  public checkStatus: any = () => {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      this.route.navigate(['/']);
      return false;
    } else {
      return true;
    }
  } // end checkStatus

  // event we have to wait from the server
  public verifyUserConfirmation: any = () => {
    this.socket.verifyUser().subscribe((data) => {
      this.disconnectedSocket = false;
      this.socket.setUser(Cookie.get('authToken'));
      // console.log('userverified');
    });
  } // end of verifyUserConformation

  // getting the onbline users list
  public getOnlineUserList: any = () => {
    this.socket.OnlineUserList().subscribe((userList) => {
      this.userList = [];
      // tslint:disable-next-line:forin // tslint:disable-next-line:prefer-const
      for (let x in userList) {
        // tslint:disable-next-line:prefer-const
        let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };
        this.userList.push(temp);
      }
      // console.log(this.userList);
    });

    // console.log('userList');
  }

  public sendMessage(messageText): any {
    if (messageText) {
      // tslint:disable-next-line:prefer-const
      let MsgObject = {
        senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('useremail'),
        receiverId: Cookie.get('userId'),
        message: messageText + this.userInfo.firstName + ' ' + this.userInfo.lastName,
        createdOn: new Date()
      }; // end of chatMsgObject
      // console.log(MsgObject);
      this.socket.SendMessage(MsgObject);
    } else {
      this.toastr.warning('text mesage can not be empty');
    }
  }

  // end fof socket

  public logout: any = () => {
    this.http.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log('logout called');
        // console.log(apiResponse);
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        this.socket.exitSocket();
        this.route.navigate(['/']);
      } else {
        // console.log(apiResponse);
        this.toastr.error(apiResponse.message);
      } // end of condition
    }, (err) => {
      this.toastr.error('Some error occured');
    });
  } // end Logout



}


