import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../navbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor( public nav: NavbarService ) {
    nav.show();
  }

  ngOnInit() {}

}
