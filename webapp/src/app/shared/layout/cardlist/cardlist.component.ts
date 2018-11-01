import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, DoCheck, IterableDiffers, OnChanges} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.scss']
})
export class CardlistComponent implements OnInit, OnDestroy {

  @Input() title;
  @Input() description;
  @Input() items$: Observable<DataCard[]>;

  @Output() clickActionCard: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onClickAction(number:number, item:DataCard) {
    this.clickActionCard.emit({
      "action_number": number,
      "item": item.model
    });
  }
}

export interface DataCard {
  model:any;
  title:string;
  subtitle:string;
  description:string,
  action_1_name:string;
  action_2_name:string;
}
