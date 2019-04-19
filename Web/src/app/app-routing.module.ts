import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ActivityLogComponent} from './activity-log/activity-log.component';
import {ProfileComponent} from './profile/profile.component';
import {ProjectComponent} from './project/project.component';
import {UserCreateComponent} from './user-create/user-create.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserListComponent} from './user-list/user-list.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: 'activity-log', component: ActivityLogComponent, data: { title: 'Activity Log' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
  { path: 'project', component: ProjectComponent, data: { title: 'Project name' } },
  { path: 'user-create', component: UserCreateComponent, data: { title: 'Create user' } },
  { path: 'user-edit', component: UserEditComponent, data: { title: 'User edit' } },
  { path: 'users', component: UserListComponent, data: { title: 'Users' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
