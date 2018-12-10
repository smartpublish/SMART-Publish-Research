export interface IContributor {

}

export class Contributor implements IContributor {
  public readonly ethAddress:string;
  public readonly ORCID:string;

  constructor(ORCID:string, ethAddress?:string) {
    this.ORCID = ORCID;
    this.ethAddress = ethAddress;
  }
}