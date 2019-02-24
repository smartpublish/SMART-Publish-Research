import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { Observable } from 'rxjs'
import { Paper } from '@app/shared/models';
import { MediaService } from '@app/core/services';

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.scss'],
})
export class CardlistComponent {

  @Input() title: string
  @Input() description: string
  @Input() items$: Observable<DataCard[]>

  @Output() clickActionCard: EventEmitter<any> = new EventEmitter()
  @Output() clickCard: EventEmitter<any> = new EventEmitter()

  constructor(
    private mediaService: MediaService
  ) { }

  onClickCard(item: DataCard, $event) {
    $event.stopPropagation()
    this.clickCard.emit(item)
  }

  onClickAction(number: number, item: DataCard, $event) {
    $event.stopPropagation()
    this.clickActionCard.emit({
      'action_number': number,
      'item': item.model
    })
  }

}

export interface DataCard {
  model: any
  title: string
  subtitle: string
  image: string,
  description: string,
  action_1_name: string
  action_2_name: string
  tags: string[]
}
