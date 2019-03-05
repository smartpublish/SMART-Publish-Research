import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { AuthenticationService } from '../services'
import { Observable } from 'rxjs';

/**
 * Add authorization header with jwt token if available
 */
@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authenticationService.accessToken
    if (token) {
      request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
      })
    }

    return next.handle(request)
  }
}
