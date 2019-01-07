import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

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
export class SocketService {

  private url = 'http://localhost:3000/chat';
  private socket;
  public userEmail = Cookie.get('receiverEmail');

  constructor(public http: HttpClient) {
    // connection is being initailized
    // that hand shake is happening
    this.socket = io(this.url);
  }

  // Events that are to be listened

  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end of verify User

  public OnlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userlist) => {
        observer.next(userlist);
      }); // end Socket
    }); // end Observable
  } // end of Online UserList

  public OnlineUserChange = (listId) => {
    return Observable.create((observer) => {
      this.socket.on(listId, (change) => {
        observer.next(change);
      }); // end Socket
    }); // end Observable
  } // end of Online UserList

  public disconnectedSocket = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      }); // end Socket
    }); // end Observable
  } // end of discnnected Socket


  // Events that are to be emitted

  public setUser = (authToken) => {
    this.socket.emit('set-user', authToken);
  } // end of set User

  public getChat = (senderId, receiverId, skip): Observable<any> => {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authToken')}`)
    .do(data => console.log('Data Received'))
    .catch(this.handleError);
  }

  public notifyChange = (listId) => {
    console.log('notify-change', listId);
    this.socket.emit('notify-group', listId);
  }

public OfflineUserList(userId): Observable<any> {
  console.log(userId);
  console.log(Cookie.get('authToken'));
      // tslint:disable-next-line:max-line-length
      console.log(`${this.url}/api/v1/chat/unseen/user/list?&userId=}` + userId + `&authToken=${Cookie.get('authToken')}`);
      return this.http.get(`${this.url}/api/v1/chat/unseen/user/list?&userId=` + userId + `&authToken=${Cookie.get('authToken')}`)

      .do(data => console.log('Data Received'))
      .catch(this.handleError);
}

  public ByUserId = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); // end of socket
    }); // end of Observable
  } // end chatByUserId


  public shareList = (shareobj) => {
    console.log(shareobj);
    this.socket.emit('notify-share', shareobj);
  } // sending Message



  public ByUserEmail = (userEmail) => {
    return Observable.create((observer) => {
      this.socket.on(userEmail, (data) => {
        observer.next(data);
      }); // end of socket
    }); // end of Observable
  } // end chatByUserId

  public SendMessage = (MsgObject) => {
    this.socket.emit('notify-msg', MsgObject);
  } // sending Message


  public exitSocket = () => {
    this.socket.disconnect();
  } // end of exit Socket

  private handleError(err: HttpErrorResponse) {
    // tslint:disable-next-line:prefer-const
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `AN error Occured: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error Message is: ${err.message}`;
    } // end of if condition

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  } // End of Error Handler
}
