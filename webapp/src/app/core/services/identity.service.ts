import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { AuthenticationService } from './authentication.service'
import { EthereumService } from './ethereum.service'
import { environment } from '@env/environment';
import { retry, catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { Signature } from 'ethers/utils';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  readonly identitiesUrl = environment.identities.uri + 'auth/identities'
  readonly httpOptions
  private handleError: HandleError

  constructor(
    private ethereumService: EthereumService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authService.accessToken,
        'Accept': 'application/json',
      })
    }
    this.handleError = httpErrorHandler.createHandleError('IdentityService');
  }

  getIdentities(accounts:String[]):Observable<any> {
    return this.http.get<any>(this.identitiesUrl, this.httpOptions)
  }

  registerIdentity(jwt:String, signature:String):Observable<any> {
    return this.http.post<any>(this.identitiesUrl, {'Signature': signature}, this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError('registerIdentity'))
      )
  }

  async registerMyCurrentIdentity() {
    const jwt = this.httpOptions.headers.Authorization
    const signer = await this.ethereumService.getProvider().getSigner()
    const signature = await signer.signMessage(jwt)
    return this.registerIdentity(jwt, signature)
  }
}

export interface Identity {
  ethAccount: string,
  fullname: string,
  userId: string
}