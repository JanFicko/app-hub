import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../../services/navbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( public nav: NavbarService ) {
    this.nav.hide();
  }

  ngOnInit() {}

}
