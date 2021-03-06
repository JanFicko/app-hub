import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Project } from '../models/project';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  env = environment;
  projects: Project[] = [];
  androidProjects: Project[] = [];
  iosProjects: Project[] = [];
  project: Project = new Project();

  constructor( private http: HttpClient ) { }

  getProjects(platform: string) {
    const user: User = JSON.parse(localStorage.getItem('loggedInUser'));
    return this.http.post<any>(`${this.env.service_url}/api/projects`, { platform: platform, userId: user._id } )
      .pipe(map(response => {
        if (response.code === 0) {
          this.projects = [];
          this.androidProjects  = [];
          this.iosProjects = [];
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
  getAllProjects() {
    return this.http.get<any>(`${this.env.service_url}/api/projects/allProjects` )
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
    return this.http.post<any>(`${this.env.service_url}/api/projects/jobs`, { projectId: projectId, userId: user._id } )
      .pipe(map(response => {
        if (response.code === 0) {
          this.project = response.project;
          return this.project;
        } else {
          return null;
        }
      }));
  }
  updateProject(projectId, packageName) {
    return this.http.put<any>(`${this.env.service_url}/api/projects/${projectId}`,
      { packageName: packageName, downloadPassword: null }
      ).pipe(map(response => {
        return response;
      }));
  }
  updateJob(jobId, version, changeLog) {
    return this.http.put<any>(`${this.env.service_url}/api/projects/job/${jobId}`, { version: version, changeLog: changeLog } )
      .pipe(map(response => {
        return response;
      }));
  }
  updateProjectAccessPermissions(userId: string, projects) {
    return this.http.post<any>(`${this.env.service_url}/api/projects/userAccess`, { userId: userId, projects: projects } )
      .pipe(map(response => {
        return response.code === 0;
      }));
  }
  getArtifacts(jobId: number) {
    return this.http.post<any>(`${this.env.service_url}/api/projects/androidArtifacts`, { jobId: jobId } )
      .pipe(map(response => {
        if (response.code === 0) {
          return response.outputs;
        } else {
          return null;
        }
      }));
  }
  downloadArtifact(jobId: number, userId: string, artifactName: string) {
    return this.http.get(`${this.env.service_url}/api/projects/download/${jobId}/${userId}/${artifactName}`, { responseType: 'blob'} )
      .pipe(map(response => {
        return response;
      }));
  }
}
