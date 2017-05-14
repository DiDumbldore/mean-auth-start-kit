import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  //properties
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  //reach to backend api and make post request to register
  registerUser(user){
    //set a header value
    let headers = new Headers();
    //add content-type json
    headers.append('Content-Type', 'application/json');
    //return Observable with response
    return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    //post request to authenticate
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
      .map(res => res.json());  
  }

  //Authenticated request
  getProfile(){
    let headers = new Headers();
    this.loadToken(); 
    // console.log('Token loaded ' +this.authToken);
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/profile', {headers: headers})
      .map(res => res.json()); 
      //if we'll run this without a token we will get 'Unauthorized'
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    //we need to stringify user cause localStorage stores only strings
    localStorage.setItem('user', JSON.stringify(user));
    //set authService properties
    this.authToken = token;
    this.user = user;
  }

  //load token from localStorage to run it in getProfile()
  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  
}
