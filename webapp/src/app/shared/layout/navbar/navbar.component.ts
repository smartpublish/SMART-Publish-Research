import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '@app/core/services'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
