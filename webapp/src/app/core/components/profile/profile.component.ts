import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '@app/core/services'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile$: any

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.profile$ = this.authService.getProfile()
  }

}
