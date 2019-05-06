import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NavbarService } from '../../services/navbar.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  constructor(
    public nav: NavbarService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceDetectorService) {
    this.nav.hide();
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.userService.logout();
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUri'] || '/';
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const di = this.deviceService.getDeviceInfo();
    const deviceInfo = di.browser + ' ' + di.browser_version + '/' + di.os + ' ' + di.os_version;
    this.userService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value, deviceInfo)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        });
  }

}
