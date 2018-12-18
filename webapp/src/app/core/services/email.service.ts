import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  readonly endpoint = environment.mailgun_config.api_base_url + '/messages';
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('api:' + environment.mailgun_config.api_key)
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  public send(from:string, to:string, subject:string, message:string):Observable<any> {
    let body = new URLSearchParams();
    body.set('from', from);
    body.set('to', to);
    body.set('subject', subject);
    body.set('text', message);
 
    return this.http.post<any>(this.endpoint,
      body,
      this.httpOptions).pipe(
        tap(_ => console.log('Yo!')),
        catchError(this.handleError<any>('sendMail'))
      )
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
