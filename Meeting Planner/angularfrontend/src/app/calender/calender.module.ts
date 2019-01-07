import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCalenderComponent } from './admin-calender/admin-calender.component';
import { UserCalenderComponent } from './user-calender/user-calender.component';
import { RouterModule } from '@angular/router';


// Angular Calender
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// User Cloaender
import { DemoUtilsModule } from '../demo-utils/module';

@NgModule({
  declarations: [AdminCalenderComponent, UserCalenderComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild([
      { path: 'admin-cal/:userId', component: AdminCalenderComponent },
      { path: 'user-cal/:userId', component: UserCalenderComponent }
    ]),
    DemoUtilsModule
  ],
  exports: [AdminCalenderComponent, UserCalenderComponent]
})
export class CalenderModule { }
