import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

// Importing httpServices
import { HttpHeaders, HttpParams } from '@angular/common/http';
// import { HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://api.efficiencttech.com/api/v1/';

  private appurl = 'http://efficiencttech.com/';

  constructor(public http: HttpClient) { }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('mobileNumber', data.mobile)
      .set('password', data.password)
      .set('userType', data.userType);

    return this.http.post(`${this.url}signup`, params);
  } // end of signup function

  public userList(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'));
    return this.http.post(`${this.url}userlist`, params);
  }

  // SIGN IN
  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this.http.post(`${this.url}login`, params);
  }
  // END OF SIGN IN

  public forgotPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('url', this.appurl)
      .set('email', data.email);
    return this.http.post(`${this.url}forgot`, params);
  }

  public savePassword(data): Observable<any> {
    const params = new HttpParams()
      .set('password', data.password)
      .set('email', data.email);
    return this.http.post(`${this.url}savePassword`, params);
  }

  public setUserEvents(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('events', JSON.stringify(data.events))
      .set('adminemail', data.adminemail)
      .set('adminId', data.adminId)
      .set('useremail', data.useremail)
      .set('userId', data.userId);
    return this.http.post(`${this.url}setuserEvents`, params);
  }

  public getUserEvents(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('adminemail', data.adminemail)
      .set('useremail', data.useremail);
    // console.log(Cookie.get('authToken'));
    // console.log(params);
    return this.http.post(`${this.url}getuserEvents`, params);
  }

  public getOnlyUserEvents(data): Observable<any> {
    // console.log(data);
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('userId', data.userId)
      .set('useremail', data.useremail);
    // console.log(params);
    return this.http.post(`${this.url}getOnlyUserEvents`, params);
  }

  public deleteUserEvents(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('adminemail', data.adminemail)
      .set('useremail', data.useremail);
    return this.http.post(`${this.url}deleteuserEvents`, params);
  }

  public mail(userId, message): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('userId', userId)
      .set('message', message);
      // console.log(params);
    return this.http.post(`${this.url}mail`, params);
  }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo')); // converting the JSON or String to Java Script Object
  }// end getUserInfoFromLocalstorage

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data)); // converting javaScript Object to JSON or String
  }

  public logout(): Observable<any> {
    localStorage.clear();
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('userId', Cookie.get('receiverId'));
    // console.log(params);
    return this.http.post(`${this.url}logout`, params);

  } // end logout function

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
