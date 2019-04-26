import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../../services/user.service';
import {NavbarService} from '../../services/navbar.service';
import {ProjectService} from '../../services/project.service';
import {first} from 'rxjs/operators';
import {Project} from '../../models/project';
import {User} from '../../models/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(
    public nav: NavbarService,
    public userService: UserService,
    public projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getProjects();
  }
  getProjects() {
    this.projectService
      .getProjects('all')
      .pipe(first())
      .subscribe();
  }
}
