import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient ) { }

  login(email: string, password: string, deviceInfo: string) {
    return this.http.post<any>(`http://localhost:3000/api/users/login`, { email: email, password: password, deviceInfo: deviceInfo } )
      .pipe(map(response => {
        // Login successful if there's a jwt token in the response
        if (response.user && response.token) {
          response.user.token = response.token;

          localStorage.setItem('loggedInUser', JSON.stringify(response.user));
        }
        return response.user;
      }));
  }
  getUsers() {
    return this.http.get<any>(`http://localhost:3000/api/users/`)
      .pipe(map(response => {
        if (response.code === 0) {
          return response.users;
        } else {
          return null;
        }
      }));
  }
  createUser(email: string, password: string, isAdmin: boolean = false) {
    return this.http.post<any>(`http://localhost:3000/api/users/`, { email: email, password: password, isAdmin: isAdmin })
      .pipe(map(response => {
        return response.code;
      }));
  }
  getUser(userId: string) {
    return this.http.get<any>(`http://localhost:3000/api/users/${userId}`)
      .pipe(map(response => {
        if (response.code === 0) {
          return response.user;
        } else {
          return null;
        }
      }));
  }
  updateUser(userId: string, isAdmin: boolean, isBanned: boolean, password: string) {
    return this.http.put<any>(`http://localhost:3000/api/users/`,
      { userId: userId, isAdmin: isAdmin, isBanned: isBanned, password: password} )
      .pipe(map(response => {
        if (response.code === 0) {
          return response.user;
        } else {
          return null;
        }
      }));
  }
  logout() {
    localStorage.removeItem('loggedInUser');
  }
  getLoggedInUser() {
    const user: User = JSON.parse(localStorage.getItem('loggedInUser'));
    return user;
  }

}
