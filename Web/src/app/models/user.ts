import {UserActivity} from './user-activity';
import {Project} from './project';
import {DatePipe} from '@angular/common';

export class User {
  _id: string;
  email: string;
  registerTime: DatePipe;
  isAdmin: boolean;
  isBanned: boolean;
  token: string;
  userActivity: UserActivity[] = [];
  projects: Project[] = [];
  androidProjects: Project[] = [];
  iosProjects: Project[] = [];
}
