import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../../services/navbar.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  constructor(
    public nav: NavbarService,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nav.show();
  }
  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.userService
      .getUsers()
      .pipe(first())
      .subscribe(users => {
        if (users != null) {
          for (const user of users) {
            if (user.projects != null && user.projects.length !== 0) {
              for (const project of user.projects) {
                if (project.platform === 'android') {
                  user.androidProjects.push(project);
                } else if (project.platform === 'ios') {
                  user.iosProjects.push(project);
                }
              }
            }
            this.users.push(user);
          }
        } else {
          this.router.navigate(['/']);
        }
      });
  }
}
