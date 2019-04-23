import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavbarService} from '../../services/navbar.service';

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(
    public nav: NavbarService,
    private router: Router
  ) {
    console.log('project');
    this.nav.show();
  }
  ngOnInit() {}

}
