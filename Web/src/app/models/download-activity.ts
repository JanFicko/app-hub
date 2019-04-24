import {DatePipe} from '@angular/common';

export class DownloadActivity {
  id: string;
  ip: string;
  userUuid: string;
  downloadTime: DatePipe;
}
