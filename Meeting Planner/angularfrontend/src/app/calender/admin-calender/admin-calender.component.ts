import { Component, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

import { SocketService } from 'src/app/socket.service';
import { Location } from '@angular/common';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-admin-calender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-calender.component.html',
  styleUrls: ['./admin-calender.component.css'],
  providers: [SocketService]
})
export class AdminCalenderComponent implements OnInit {

  // socket
  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userId: any;
  public useremail: any;
  public userList: any = [];
  // public OffLineuserList: any = [];
  public disconnectedSocket: boolean;
  public messageText: any;

  // tslint:disable-next-line:max-line-length
  constructor(private location: Location, public route: Router, public socket: SocketService, private modal: NgbModal, private _router: ActivatedRoute, public toastr: ToastrService, public http: AppService) { 
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      this.route.navigate(['login']);
    }
  }

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();


  public start: Date;
  public end: Date;
  public title: string;
  public color = colors.red;
  public message: string;
  public result: any;
  public adminName = Cookie.get('receiverName');
  public index;

  events: CalendarEvent[] = [
    {
      start: new Date(),
      end: new Date(),
      title: '~Default Event',
      location: 'Location',
      color: colors.red,
      message: 'Purpose',
      adminName: this.adminName,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  // tslint:disable-next-line:no-inferrable-types
  activeDayIsOpen: boolean = true;

  ngOnInit() {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      this.route.navigate(['login']);
    }
    this.events.shift();
    // tslint:disable-next-line:prefer-const
    let data = {
      userId: this._router.snapshot.paramMap.get('userId'),
      useremail: Cookie.get('useremail'),
      adminId: Cookie.get('receiverId'),
      adminemail: Cookie.get('receiverEmail'),
    };

    // console.log(data);

    this.http.getUserEvents(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        this.result = apiResponse.data.events;
        // console.log(apiResponse.data);
        // tslint:disable-next-line:prefer-const
        for (let obj of apiResponse.data) {
          // console.log(obj.events);
          // tslint:disable-next-line:prefer-const
          for (let x of obj.events) {
            // console.log(x.title);
            this.events.push({
              title: x.title,
              start: new Date(x.start),
              end: new Date(x.end),
              location: x.location,
              message: x.message,
              adminName: x.adminName,
              color: colors.red,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              }
            });
            this.refresh.next();
          }
        }
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

    // socket
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.http.getUserInfoFromLocalstorage();
    this.receiverName = Cookie.get('receiverName');
    this.receiverId = Cookie.get('receiverId');
    this.useremail = Cookie.get('useremail');
    this.userId = Cookie.get('userId');
    // console.log(this.receiverId, this.receiverName);
    // console.log(this.userId, this.useremail);
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();

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
      this.socket.setUser(this.authToken);
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

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      location: 'Location',
      message: 'Purpose',
      adminName: Cookie.get('receiverName'),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
    // console.log(this.events);
  }

  public saveAll = () => {
    this.saveEvents('Stop');
  }

  public updateEvents = () => {
    this.saveEvents('Events Updated by Admin: ');
    setTimeout(() => {
      this.saveAll();
    }, 2000);
    // tslint:disable-next-line:max-line-length
    this.http.mail(this._router.snapshot.paramMap.get('userId'), `Events Updated by Admin : ${Cookie.get('receiverName')}`).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        this.toastr.success(apiResponse.message);
      } else {
        this.toastr.error(apiResponse.message);
      } // end of condition
    }, (err) => {
      this.toastr.error('Some error occured');
    });
    // tslint:disable-next-line:max-line-length
    // console.log('mail Sent to ' + this._router.snapshot.paramMap.get('userId') + `Events Updated by Admin : ${Cookie.get('receiverId')}`);
  }

  public addedEvent = () => {
    console.log('AddEvent Called');
    this.saveEvents('Events Added by Admin: ');
    // tslint:disable-next-line:max-line-length
    this.http.mail(this._router.snapshot.paramMap.get('userId'), `Events Added by Admin : ${Cookie.get('receiverName')}`).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        this.toastr.success(apiResponse.message);
      } else {
        this.toastr.error(apiResponse.message);
      } // end of condition
    }, (err) => {
      this.toastr.error('Some error occured');
    });
  }

  public saveEvents = (change) => {
    // tslint:disable-next-line:prefer-const
    let data = {
      userId: this._router.snapshot.paramMap.get('userId'),
      useremail: Cookie.get('useremail'),
      adminId: Cookie.get('receiverId'),
      adminemail: Cookie.get('receiverEmail'),
      events: this.events
    };

    // console.log(data);

    this.http.deleteUserEvents(data).subscribe((apiResponse) => {
      // console.log(apiResponse);
      if (apiResponse.status === 200) {
        console.log('old Events deleted');

        // tslint:disable-next-line:prefer-const
        let savedata = {
          userId: this._router.snapshot.paramMap.get('userId'),
          useremail: Cookie.get('useremail'),
          adminId: Cookie.get('receiverId'),
          adminemail: Cookie.get('receiverEmail'),
          events: this.events
        };
        // console.log(this.events);
        // console.log(savedata);

        this.http.setUserEvents(savedata).subscribe((apiResponse1) => {
          // console.log(apiResponse1);

          if (apiResponse.status === 200) {
            // console.log(apiResponse1);
          } else {
            this.toastr.error(apiResponse1.message);
          }
          // End of conditional
        }, (err) => {
          this.toastr.error('some error occurred');
        }
          // end of function
        );

        // end of set Events
      } else {
        this.toastr.error(apiResponse.message);
      }
      // End of conditional
    }, (err) => {
      this.toastr.error('some error occurred');
    });
    if (change === 'Stop') {
      console.log('Updating');
    } else {
      this.sendMessage(change);
    }

  }

  public logout: any = () => {
    this.http.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log('logout called');
        // console.log(apiResponse);
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        this.socket.exitSocket();
        this.route.navigate(['/']);
      } else {
        this.toastr.error(apiResponse.message);
      } // end of condition
    }, (err) => {
      this.toastr.error('Some error occured');
    });
  } // end Logout


}
