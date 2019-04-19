import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient ) { }

  login(email: string, password: string) {
    const options = { headers: new HttpHeaders({
        'Content-Type': 'application/json' }) };
    return this.http.post<any>(`http://localhost:3000/api/users/login`, { email: email, password: password }, options )
      .pipe(map(response => {
        // TODO: Save user
        // login successful if there's a jwt token in the response
        if (response.user && response.token) {
          response.user.token = response.token;

          localStorage.setItem('loggedInUser', JSON.stringify(response.user));
        }
        return response.user;
      }));
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }

}
