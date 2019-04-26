import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { ProjectService } from '../../services/project.service';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    public nav: NavbarService,
    public projectService: ProjectService,
    private router: Router
  ) {
    this.nav.show();
  }
  ngOnInit() {}

}
