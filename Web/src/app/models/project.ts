import { Job } from './job';
import { UserAccess } from './user-access';

export class Project {
  _id: string;
  projectId: number;
  name: string;
  bundleIdentifier: string;
  path: string;
  platform: string;
  icon: string;
  jobs: Job[] = [];
  allowedUserAccess: UserAccess[];
}
