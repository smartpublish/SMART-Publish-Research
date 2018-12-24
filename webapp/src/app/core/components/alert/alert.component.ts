import { AlertService } from '@app/core/services/alert.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  dismissible = true;
  message$: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.message$ = this.alertService.getMessage();
  }

  ngOnDestroy() {
  }

}
