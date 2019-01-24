import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '@app/core/services'

@Component({
  selector: 'app-user-logged-navbar',
  templateUrl: './user-logged-navbar.component.html',
  styleUrls: ['./user-logged-navbar.component.scss']
})
export class UserLoggedNavbarComponent implements OnInit {

  profile$: any

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.profile$ = this.authService.getProfile()
  }
}
