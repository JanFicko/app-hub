import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../../services/navbar.service';
import {UserService} from '../../services/user.service';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../../models/user';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User = new User();
  projects: Project[] = [];
  androidProjects: Project[] = [];
  iosProjects: Project[] = [];
  editUserForm: FormGroup;
  loading = true;
  formConfig = { password: [] };
  updateUserRequest = [];
  constructor(
    public nav: NavbarService,
    public userService: UserService,
    public projectService: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nav.show();
  }

  ngOnInit() {
    this.editUserForm = this.formBuilder.group({
      isAdmin: [],
      isBanned: [],
      password: []
    });
    this.route.params.subscribe(
      params => {
        this.getUser(params['userId']);
        this.getProjects();
      }
    );
  }
  onSubmit() {
    this.formConfig['password'] = this.editUserForm.controls.password.value;
    this.editUserForm = this.formBuilder.group(this.formConfig);
    this.extractCheckboxes(this.editUserForm.controls);
    this.updateUser();
  }
  extractCheckboxes(controls) {
    Object.keys(this.formConfig).forEach(key => {
      if (key !== 'isAdmin' && key !== 'isBanned' && key !== 'password') {
        const splitted = key.split('_');
        const checkbox = splitted[0];
        const projectId = splitted[1];
        if (checkbox === 'check') {
          if (controls[key].value) {
            let privilegeType = 'Full';
            if (!controls['checkfull_' + projectId].value) {
              privilegeType = 'Latest';
            }
            this.updateUserRequest.push({
              projectId: Number(projectId), privilegeType: privilegeType
            });
          } else {
            this.updateUserRequest.push({
              projectId: Number(projectId), privilegeType: 'None'
            });
          }
        }
      }
    });
  }
  updateUser() {
    this.userService.updateUser(
      this.user._id,
      this.editUserForm.controls.isAdmin.value,
      this.editUserForm.controls.isBanned.value,
      this.editUserForm.controls.password.value
    )
      .pipe(first())
      .subscribe(response => {
        this.projectService.updateProjectAccessPermissions(
          this.user._id,
          this.updateUserRequest)
          .pipe(first())
          .subscribe(() => {
            window.location.reload();
          });
      });
  }
  getUser(userId: string) {
    this.userService.getUser(userId)
      .pipe(first())
      .subscribe(user => {
        if (user != null) {
          this.formConfig['isAdmin'] = [user.isAdmin];
          this.formConfig['isBanned'] = [user.isBanned];
          this.user = user;
        } else {
          this.router.navigate(['/']);
        }
      });
  }
  getProjects() {
    this.projectService
      .getAllProjects()
      .pipe(first())
      .subscribe(projects => {
        console.log(projects);
        this.projects = projects;
        for (const project of projects) {
          project.hasPermission = this.checkIfUserHasPermissionForProject(project.projectId);
          project.hasFullAccess = this.checkUserPrivilegesForProject(project.projectId);
          if (project.platform === 'android') {
            this.androidProjects.push(project);
          } else if (project.platform === 'ios') {
            this.iosProjects.push(project);
          }
        }
        this.editUserForm = this.formBuilder.group(this.formConfig);
        this.loading = false;
      });
  }
  checkIfUserHasPermissionForProject(projectId: number) {
    for (const project of this.projects) {
      if (project.projectId === projectId) {
        for (const access of project.allowedUserAccess) {
          if (access.user_uuid === this.route.snapshot.params.userId) {
            this.formConfig['check_' + projectId] = [true];
            return true;
          }
        }
        this.formConfig['check_' + projectId] = [false];
        return false;
      }
    }
  }
  checkUserPrivilegesForProject(projectId: number) {
    for (const project of this.projects) {
      if (project.projectId === projectId) {
        for (const access of project.allowedUserAccess) {
          if (access.user_uuid === this.route.snapshot.params.userId && access.privilegeType === 'Full') {
            this.formConfig['checkfull_' + projectId] = [true];
            return true;
          }
        }
        this.formConfig['checkfull_' + projectId] = [false];
        return false;
      }
    }
  }
  toggleCheckbox(checkbox: string) {
    this.formConfig[checkbox] = [!this.editUserForm.controls[checkbox].value];
  }

}
