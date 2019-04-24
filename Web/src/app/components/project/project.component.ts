import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs/operators';
import { Project } from '../../models/project';

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  project: Project = new Project();
  constructor(
    public nav: NavbarService,
    public projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nav.show();
  }
  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.getJobs(params['projectId']);
      }
    );
  }
  getJobs(projectId: number) {
    this.projectService
      .getJobs(projectId)
      .pipe(first())
      .subscribe(project => {
        if (project != null) {
          this.project = project;
        } else {
          this.router.navigate(['/']);
        }
      });
  }

}
