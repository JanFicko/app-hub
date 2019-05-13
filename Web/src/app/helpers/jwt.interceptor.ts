import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private deviceService: DeviceDetectorService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authorization header with jwt token if available
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const di = this.deviceService.getDeviceInfo();
    const deviceInfo = di.browser + ' ' + di.browser_version + '/' + di.os + ' ' + di.os_version;
    console.log(deviceInfo);
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
          DeviceInfo: deviceInfo
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          DeviceInfo: deviceInfo
        }
      });
    }

    return next.handle(request);
  }
}
