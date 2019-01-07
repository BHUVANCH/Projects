import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as $ from 'jquery';

// Socket
// import { ElementRef } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
// import { ChatMessage } from './chat'; intercface
// import { CheckUser } from './CheckUser'; status

import { AnimationStyleMetadata } from '@angular/animations';
import {
  ViewEncapsulation
} from '@angular/core';

import {
  ViewChild,
  TemplateRef
} from '@angular/core';
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
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { NgOnChangesFeature } from '@angular/core/src/render3';

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
  selector: 'app-user-calender',
  templateUrl: './user-calender.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./user-calender.component.css'],
  providers: [SocketService]
})


export class UserCalenderComponent implements OnInit {


  public result: any;

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



  // tslint:disable-next-line:no-inferrable-types
  activeDayIsOpen: boolean = true;

  // socket
  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public messageText: any;
  public adminmeeting: any;
  public startMeeting: any;


  // tslint:disable-next-line:max-line-length
  constructor(public socket: SocketService, private modal: NgbModal, public toastr: ToastrService, public route: Router, public _router: ActivatedRoute, public http: AppService) {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      this.route.navigate(['login']);
    }
  }

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      message: 'Purpose',
      location: 'Location',
      adminName: 'AdminName',
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];


  ngOnInit() {

    // tslint:disable-next-line:prefer-const
    this.events.shift();
    // tslint:disable-next-line:prefer-const
    let data = {
      userId: this._router.snapshot.paramMap.get('userId'),
      useremail: Cookie.get('receiverEmail'),
    };

    this.http.getOnlyUserEvents(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        // console.log(apiResponse);
        // tslint:disable-next-line:prefer-const
        for (let obj of apiResponse.data) {
          for (let x of obj.events) {
            // console.log(x.adminName);
            this.events.push({
              title: x.title,
              start: new Date(x.start),
              end: new Date(x.end),
              message: x.message,
              adminName: x.adminName,
              location: x.location,
              color: colors.blue,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              }
            });
            this.refresh.next();
          }
        }
        this.toastr.success('Events Loaded');
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

    // console.log(this.receiverId, this.receiverName);

    this.checkStatus();
    this.verifyUserConfirmation();
    this.getMessageFromAUser();
  }

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
      message: 'Purpose',
      location: 'Location',
      adminName: 'Admin',
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  // weather user is online or not
  public checkStatus: any = () => {
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === null || Cookie.get('authToken') === '') {
      this.route.navigate(['/login']);
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

  // subscribing to your own ID to get the messages
  public getMessageFromAUser = () => {
    this.socket.ByUserId(this.userInfo.userId).subscribe((data) => {
      // console.log(data.message);
      if (data.message === 'Meeting') {
        this.openModal();
        this.adminmeeting = data.event.adminName;
        this.startMeeting = data.event.start;
        // this.toastr.success(data.message);
      } else {
        this.toastr.success(data.message + 'Refresh Your Page to view Changes');
        this.events.length = 0;
        $('#here').load('#here');
      }
    }); // end of subscribe
  } // end get message from user

  public openModal() {
    // console.log('Open Modal');
    // tslint:disable-next-line:prefer-const
    let element: HTMLElement = document.getElementById('dynamic') as HTMLElement;
    element.click();
  }

  public snoozeMeeting = () => {
    console.log('Snooze Meeting');
    setTimeout(() => {
      // tslint:disable-next-line:prefer-const
      let element: HTMLElement = document.getElementById('dynamic') as HTMLElement;
      element.click();
    }, 5000);
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
        console.log(apiResponse);
        this.toastr.error(apiResponse.message);
      } // end of condition
    }, (err) => {
      this.toastr.error('Some error occured');
    });
  } // end Logout

}


