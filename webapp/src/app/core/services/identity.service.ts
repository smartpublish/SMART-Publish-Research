import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { AuthenticationService } from './authentication.service'
import { EthereumService } from './ethereum.service'
import { environment } from '@env/environment';
import { retry, catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { Signature } from 'ethers/utils';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  readonly identitiesUrl = environment.identities.uri + 'auth/identity'
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
        'Accept': 'application/json'
      })
    }
    this.handleError = httpErrorHandler.createHandleError('IdentityService');
  }

  getIdentities(accounts:String[]):Observable<any> {
    let params = new HttpParams()
    params = params.append('accounts', accounts.join(','))
    return this.http.get<any>(this.identitiesUrl, { params: params })
  }

  registerIdentity(jwt:String, signature:String, account:String, fullName:string):Observable<any> {
    return this.http.post<any>(this.identitiesUrl, 
      {
        'signature': signature,
        'account': account,
        'userName': fullName
      }, this.httpOptions)
  }

}

export interface Identity {
  ethAccount: string,
  fullname: string,
  userId: string
}