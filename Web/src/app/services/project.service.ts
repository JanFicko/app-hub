import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Project } from '../models/project';
import {User} from '../models/user';
import {Job} from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[] = [];
  androidProjects: Project[] = [];
  iosProjects: Project[] = [];
  project: Project = new Project();

  constructor( private http: HttpClient ) { }

  getProjects(platform: string) {
    const user: User = JSON.parse(localStorage.getItem('loggedInUser'));
    return this.http.post<any>(`http://localhost:3000/api/projects`, { platform: platform, userId: user._id } )
      .pipe(map(response => {
        if (response.code === 0) {
          this.projects = response.projects;
          for (const project of this.projects) {
            if (project.platform === 'android') {
              this.androidProjects.push(project);
            } else if (project.platform === 'ios') {
              this.iosProjects.push(project);
            }
          }
        }
      }));
  }
  getAllProjects(platform: string) {
    return this.http.post<any>(`http://localhost:3000/api/projects`, { platform: platform, userId: 'all'} )
      .pipe(map(response => {
        if (response.code === 0) {
          return response.projects;
        } else {
          return [];
        }
      }));
  }
  getJobs(projectId: number) {
    const user: User = JSON.parse(localStorage.getItem('loggedInUser'));
    return this.http.post<any>(`http://localhost:3000/api/projects/jobs`, { projectId: projectId, userId: user._id } )
      .pipe(map(response => {
        if (response.code === 0) {
          this.project = response.project;
          return this.project;
        } else {
          return null;
        }
      }));
  }
  updateProjectAccessPermissions(userId: string, projects) {
    return this.http.post<any>(`http://localhost:3000/api/projects/userAccess`, { userId: userId, projects: projects } )
      .pipe(map(response => {
        return response.code === 0;
      }));
  }
}
