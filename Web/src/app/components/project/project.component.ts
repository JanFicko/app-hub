import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs/operators';
import { Project } from '../../models/project';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  jobId: number;
  project: Project = new Project();
  artifacts: [] = [];
  updateProjectForm: FormGroup;
  updateJobForm: FormGroup;
  loading = false;
  constructor(
    public nav: NavbarService,
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nav.show();
  }
  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.jobId = null;
        this.updateJobForm = this.formBuilder.group({
          version: [''],
          changeLog: ['']
        });
        this.updateProjectForm = this.formBuilder.group({
          packageName: ['']
        });
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
  onSubmitProjectUpdate() {
    // stop here if form is invalid
    if (this.updateProjectForm.invalid) {
      return;
    }
    this.loading = true;
    this.projectService.updateProject(
      this.route.snapshot.params.projectId,
      this.updateProjectForm.controls.packageName.value
    )
      .pipe(first())
      .subscribe(
        data => {
          window.location.reload();
          this.loading = false;
        });
  }
  onSubmitJobUpdate() {
    // stop here if form is invalid
    if (this.updateJobForm.invalid) {
      return;
    }

    this.loading = true;
    this.projectService.updateJob(
      this.jobId,
      this.updateJobForm.controls.version.value,
      this.updateJobForm.controls.changeLog.value
    ).pipe(first())
      .subscribe(
        data => {
          window.location.reload();
          this.loading = false;
        });
  }
  setJobId(jobId: number) {
    this.jobId = jobId;
  }
  getArtifacts(jobId: number) {
    this.artifacts = [];
    this.jobId = jobId;
    this.projectService.getArtifacts(
      jobId
    ).pipe(first())
      .subscribe(
        artifacts => {
          if (artifacts != null) {
            this.artifacts = artifacts;
          }
        });
  }
  downloadArtifact(artifactName: string) {
    const fileName = artifactName.split('/');
    this.projectService.downloadArtifact(
      this.jobId,
      this.userService.getLoggedInUser()._id,
      fileName[0]
    ).subscribe( data => {
      const element = document.createElement('a');
      element.download = fileName[1];
      const blob = new Blob([data], { type: 'application/vnd.android.package-archive'});
      element.href = URL.createObjectURL(blob);
      document.body.appendChild(element);
      element.click();
    });
  }

}
