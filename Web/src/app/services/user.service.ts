import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  env = environment;

  constructor( private http: HttpClient ) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.env.service_url}/api/users/login`, { email: email, password: password } )
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
    return this.http.get<any>(`${this.env.service_url}/api/users/`)
      .pipe(map(response => {
        if (response.code === 0) {
          return response.users;
        } else {
          return null;
        }
      }));
  }
  createUser(email: string, password: string, isAdmin: boolean = false) {
    return this.http.post<any>(`${this.env.service_url}/api/users/`, { email: email, password: password, isAdmin: isAdmin })
      .pipe(map(response => {
        return response.code;
      }));
  }
  getUser(userId: string) {
    return this.http.get<any>(`${this.env.service_url}/api/users/${userId}`)
      .pipe(map(response => {
        if (response.code === 0) {
          return response.user;
        } else {
          return null;
        }
      }));
  }
  updateUser(userId: string, isAdmin: boolean, isBanned: boolean, password: string) {
    return this.http.put<any>(`${this.env.service_url}/api/users/`,
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
