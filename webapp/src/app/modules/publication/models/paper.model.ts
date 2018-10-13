export interface IAsset {

}

class AbstractAsset implements IAsset {
  ethAddress: number;
  location: string;

  constructor(location?: string, ethAddress?: number) {
    this.ethAddress = ethAddress;
    this.location = location;
  }
}

export class Paper extends AbstractAsset {
  title: string;
  abstract: string;
  file: File;

  constructor(title: string, abstract: string, file?: File, location?: string, ethAddress?: number){
    super(location, ethAddress);
    this.title = title;
    this.abstract = abstract;
    this.file = file;
  }

}
