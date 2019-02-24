import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from '@env/environment'
import * as auth0 from 'auth0-js'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _idToken: string
  private _accessToken: string
  private _expiresAt: number

  userProfile: any

  auth0 = new auth0.WebAuth(environment.auth0_config)

  constructor(public router: Router) {
    this._idToken = ''
    this._accessToken = ''
    this._expiresAt = 0
  }

  get accessToken(): string {
    return this._accessToken
  }

  get idToken(): string {
    return this._idToken
  }

  public login(): void {
    this.auth0.authorize()
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ''
        this.setSession(authResult)
        this.router.navigate(['/home'])
      } else if (err) {
        this.router.navigate(['/home'])
        console.log(err)
      }
    })
  }

  private setSession(authResult): void {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true')
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime()
    this._accessToken = authResult.accessToken
    this._idToken = authResult.idToken
    this._expiresAt = expiresAt
  }

  public renewSession(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`)
        this.logout()
      }
    })
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = ''
    this._idToken = ''
    this._expiresAt = 0
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn')
    // Go back to the home route
    this.router.navigate(['/'])
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this._expiresAt
  }

  public getProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.userProfile) {
        resolve(this.userProfile)
      } else {
        if (!this._accessToken) {
          reject('Access Token must exist to fetch profile')
        }

        this.auth0.client.userInfo(this._accessToken, (err, profile) => {
          if (profile) {
            this.userProfile = profile
          }
          resolve(profile)
        })
      }
    })
  }
}
