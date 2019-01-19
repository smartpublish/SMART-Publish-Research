import { Injectable } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(
    private sanitizer:DomSanitizer
  ) { }

  searchImage(terms:string[]):SafeUrl {
    let image;
    switch(terms[0]) {
      case 'Astronomy': image = 'https://telescopeobserver.com/wp-content/uploads/2017/08/astronomy-vs-astrology-1024x527.jpeg'; break;
      case 'Biology': image = 'http://blogs.biomedcentral.com/on-biology/wp-content/uploads/sites/5/2017/12/DNA.png'; break;
      case 'Chemistry': image = 'https://www.scitecheuropa.eu/wp-content/uploads/2018/06/ST27-McGillU1-image-%C2%A9-iStock-Garsya-696x392.jpg'; break;
      case 'Cognitive Science': image = '//cdn.shopify.com/s/files/1/0756/3867/files/harness-plasticity_large.png?v=1527101232'; break;
      case 'Computer Science': image = 'https://mediaplanet.azureedge.net/images/111/53639/crack-the-code.jpg'; break;
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
    return this.sanitizer.bypassSecurityTrustUrl(image)
  }

}
