import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProjectComponent } from './components/project/project.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' }, canActivate: [AuthGuard] },
  { path: 'activity-log', component: ActivityLogComponent, data: { title: 'Activity Log' }, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, data: { title: 'Profile' }, canActivate: [AuthGuard] },
  { path: 'project', component: ProjectComponent, data: { title: 'Project name' }, canActivate: [AuthGuard] },
  { path: 'user-create', component: UserCreateComponent, data: { title: 'Create user' }, canActivate: [AuthGuard] },
  { path: 'user-edit', component: UserEditComponent, data: { title: 'User edit' }, canActivate: [AuthGuard] },
  { path: 'users', component: UserListComponent, data: { title: 'Users' }, canActivate: [AuthGuard] },

  // If path doesn't exist redirect to dashboard.
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
