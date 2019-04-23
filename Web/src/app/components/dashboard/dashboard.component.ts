import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {NavbarService} from '../../services/navbar.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public nav: NavbarService,
    private router: Router
  ) {
    console.log('dashboard');
    this.nav.show();
  }
  ngOnInit() {}

}
