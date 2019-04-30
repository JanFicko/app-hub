import {DatePipe} from '@angular/common';

export class Job {
  _id: string;
  jobId: number;
  finishTime: DatePipe;
  title: string;
  filename: string;
  changeLog: string;
}
