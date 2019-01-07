import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';

// Importing toastor
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CalenderModule } from './calender/calender.module';

// Angular-Calender
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// Calender Animations
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full'},
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '*', component: LoginComponent},
  { path: '**', component: PageNotFoundComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    CalenderModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
//   // Ensure Angular destroys itself on hot reloads.
//   if (window['ngRef']) {
//     window['ngRef'].destroy();
//   }
//   window['ngRef'] = ref;

//   // Otherwise, log the boot error
// }).catch(err => console.error(err));
