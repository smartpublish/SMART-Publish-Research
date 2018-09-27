export interface IContributor {

}

class AbstractContributor implements IContributor {
  ethAddress: number;

  constructor(ethAddress: number) {
        this.ethAddress = ethAddress;
  }
}

export class Researcher extends AbstractContributor {
  name: string;
  last_name: string;

  constructor(ethAddress: number, name: string, last_name: string){
    super(ethAddress);
    this.name = name;
    this.last_name = last_name;
  }

}

export class Organization extends AbstractContributor {
  name: string;

  constructor(ethAddress: number, name: string){
    super(ethAddress);
    this.name = name;
  }
}
