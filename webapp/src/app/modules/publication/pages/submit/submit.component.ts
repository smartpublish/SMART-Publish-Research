import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '@app/core/services'

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
