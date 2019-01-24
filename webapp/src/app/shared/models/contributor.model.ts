export interface IContributor {

}

export class Contributor implements IContributor {
  public readonly ethAddress: string
  public readonly email: string

  constructor(ethAddress: string, email?: string) {
    this.email = email
    this.ethAddress = ethAddress
  }
}
