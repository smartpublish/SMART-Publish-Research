import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { Observable } from 'rxjs'
import { Paper } from '@app/shared/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.scss'],
})
export class CardlistComponent implements OnInit, OnDestroy {

  @Input() title: string
  @Input() description: string
  @Input() items$: Observable<DataCard[]>

  @Output() clickActionCard: EventEmitter<any> = new EventEmitter()
  @Output() clickCard: EventEmitter<any> = new EventEmitter()

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

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

  public static paperToCard(paper: Paper, action_1_name): DataCard {
    // TODO Refactor by Image service
    let image;
    switch(paper.topic) {
      case 'Astronomy': image = 'http://www.astronomy.com/-/media/Images/Homepage/Sliders/PIA10231_hires2.png?mw=600'; break;
      case 'Biology': image = 'http://blogs.biomedcentral.com/on-biology/wp-content/uploads/sites/5/2017/12/DNA.png'; break;
      case 'Chemistry': image = 'https://www.scitecheuropa.eu/wp-content/uploads/2018/06/ST27-McGillU1-image-%C2%A9-iStock-Garsya-696x392.jpg'; break;
      case 'Cognitive Science': image = 'http://arts-sciences.buffalo.edu/content/arts-sciences/cognitive-science/_jcr_content/top/image_1597374749.img.926.auto.jpg/1507041140648.jpg'; break;
      case 'Computer Science': image = 'https://nwc.edu/academics/photos/program-photos/computer-science.jpg'; break;
      case 'Ecology': image = 'https://cdn1.byjus.com/biology/2017/10/22121159/1-min-1.jpg'; break;
      case 'Geography': image = 'https://www.thoughtco.com/thmb/H1iqHnWHrppoMHOEy4aKEtEJgng=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/171720729-58b9d1473df78c353c38c2b1.jpg'; break;
      case 'Geology': image = 'https://www.aapg.org/portals/0/images/about_pg/gp-structural-geology.jpg?width=640'; break;
      case 'Linguistics': image = 'https://static.kent.ac.uk/nexus/ems/110.jpg'; break;
      case 'Physics': image = 'https://trinityssr.files.wordpress.com/2016/12/ms-physics.jpg?w=610'; break;
      case 'Psychology': image = 'https://www.yu.edu/sites/default/files/psychology-881350654.jpg'; break;
      case 'Sociology': image = 'https://www.hull.ac.uk/editor-assets/images/sociology/sociology.x8922048a.jpg'; break;
      case 'Scatology': image = 'https://www.barclaywholesale.com/wp-content/uploads/apaper.jpg'; break;
      case 'Zoology': image = 'http://www.bristol.ac.uk/media-library/sites/study/undergraduate/images/course/bsc-zoology-c300.jpg'; break;
      default: image = 'https://ichef.bbci.co.uk/childrens-responsive-ichef-live/r/640/1x/cbbc/science-onward-journey_v3.png'; break;
    }

    return {
      model: paper,
      title: paper.title,
      subtitle: '',
      image: image,
      description: paper.summary,
      action_1_name: action_1_name
    } as DataCard
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
}
