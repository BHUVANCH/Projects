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

  private url = 'http://localhost:3000/api/v1/';

  private appurl = 'http://localhost:4200/';

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


  // ----------------------------------Usre LIst --------------------------------------------

  public getUserLists(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('userEmail', Cookie.get('receiverEmail'))
      .set('userId', data.userId);

    console.log(params);
    return this.http.post(`${this.url}getUserLists`, params);
  }

  public saveList(data): Observable<any> {
    console.log(data);
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('userId', data.userId)
      .set('userEmail', data.userEmail)
      .set('listdetails', JSON.stringify(data.listdetails));
    console.log(params);
    return this.http.post(`${this.url}setUserlists`, params);
  }

  // ----------------------------------Usre LIst --------------------------------------------

  // ----------------------------------Task LIst --------------------------------------------

  public gettaskList(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('listName', data.listName)
      .set('listId', data.listId);
    console.log(params);
    return this.http.post(`${this.url}gettaskList`, params);
  }

  public settaskList(data): Observable<any> {
    console.log(data);
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('listId', data.listId)
      .set('listName', data.listName)
      .set('shared', JSON.stringify(data.shared))
      .set('taskArray', JSON.stringify(data.taskArray));
    console.log(params);
    return this.http.post(`${this.url}settaskList`, params);
  }

  // ----------------------------------Task LIst --------------------------------------------

  // ----------------------------------Task LIst --------------------------------------------


  public updateUser(update): Observable<any> {
    console.log(update);
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('listId', update.listId)
      .set('listName', update.listName)
      .set('userEmail', update.userEmail);
    console.log(params);
    return this.http.post(`${this.url}updateUser`, params);
  }

  // ----------------------------------Update LIst --------------------------------------------

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
