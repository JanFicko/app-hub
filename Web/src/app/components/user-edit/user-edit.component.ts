import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../../services/navbar.service';
import {UserService} from '../../services/user.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../../models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  constructor(
    public nav: NavbarService,
    public userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nav.show();
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.getUser(params['userId']);
      }
    );
  }
  getUser(userId: string) {
    this.userService.getUser(userId)
      .pipe(first())
      .subscribe(user => {
        if (user != null) {
          this.getProjects();
          this.user = user;
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  getProjects() {

  }

}
