import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../../services/navbar.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  createUserForm: FormGroup;
  loading = false;
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
    this.createUserForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: []
    });
  }
  onSubmit() {

    // Stop here if form is invalid
    if (this.createUserForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.createUser(
      this.createUserForm.controls.email.value,
      this.createUserForm.controls.password.value,
      this.createUserForm.controls.isAdmin.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            this.router.navigate(['/users']);
          } else {
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        });
  }

}
