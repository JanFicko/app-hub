import {DownloadActivity} from './download-activity';
import {DatePipe} from '@angular/common';

export class Job {
  _id: string;
  jobId: number;
  finishTime: DatePipe;
  title: string;
  filename: string;
  changeLog: string;
  downloadActivity: DownloadActivity[];
}
