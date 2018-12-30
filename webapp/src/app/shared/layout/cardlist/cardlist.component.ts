import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, DoCheck, IterableDiffers, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.scss'],
})
export class CardlistComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() description: string;
  @Input() items$: Observable<DataCard[]>;

  @Output() clickActionCard: EventEmitter<any> = new EventEmitter();
  @Output() clickCard: EventEmitter<any> = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onClickCard(item:DataCard, $event) {
    $event.stopPropagation();
    this.clickCard.emit(item);
  }

  onClickAction(number:number, item:DataCard, $event) {
    $event.stopPropagation();
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
