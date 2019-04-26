import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../../services/navbar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {first} from 'rxjs/operators';
import {User} from '../../models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();
  updateUserForm: FormGroup;
  loading = false;
  constructor(
    public nav: NavbarService,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nav.show();
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        const userId = params['userId'];
        const loggedInUser: User = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser._id === userId) {
          this.getUser(userId);
          this.updateUserForm = this.formBuilder.group({
            password: ['', Validators.required]
          });
        } else {
          this.router.navigate(['/']);
        }
      }
    );
  }
  getUser(userId: string) {
    this.userService.getUser(userId)
      .pipe(first())
      .subscribe( (user) => {
        if (user != null) {
          this.user = user;
        } else {
          this.router.navigate(['/']);
        }
      });
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.updateUserForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.updateUser(this.user._id, this.user.isAdmin, this.user.isBanned, this.updateUserForm.controls.password.value)
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
      });
  }

}
