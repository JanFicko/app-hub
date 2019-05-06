import {DatePipe} from '@angular/common';

export class UserActivity {
  id: string;
  ip: string;
  activity: string;
  activityType: string;
  time: DatePipe;
  device: string;
}
