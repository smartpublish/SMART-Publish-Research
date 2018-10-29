import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.scss']
})
export class CardlistComponent implements OnInit {

  @Input() title;
  @Input() description;
  @Input() items: DataCard[];

  @Output() clickActionCard: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
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
