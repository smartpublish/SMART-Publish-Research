import { Component, Input } from '@angular/core';
import { Paper } from '@app/shared/models';
import { Router } from '@angular/router';
import { MediaService } from '@app/core/services';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {

  @Input('paper')
  set paper(value: Paper) {
    if(value) {
      this.paperImage$ = this.decoratePaper(value)
    }
  }
  paperImage$: Promise<PaperImageDecorator>

  constructor(
    private router: Router,
    private mediaService: MediaService
  ) { }

  private decoratePaper(paper:Paper):Promise<PaperImageDecorator> {
    return new Promise<PaperImageDecorator>((resolve, reject) => {
      let url: SafeUrl = this.mediaService.searchImage([paper.topic])
      let paperImageDecorator: PaperImageDecorator = new PaperImageDecorator(paper)
      paperImageDecorator.imageUrl = url
      resolve(paperImageDecorator)
    });
  }
  
  onClickHandle() {
    this.paperImage$.then(paperImage => {
      this.router.navigate(['/detail', paperImage.paper.ethAddress])
    })
  }
}

class PaperImageDecorator {
  public imageUrl:SafeUrl
  public constructor(public paper: Paper) {}
}
