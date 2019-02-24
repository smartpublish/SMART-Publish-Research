export interface IContributor {

}

export enum ContributorType {
  AUTHOR = 'Author', COAUTHOR = 'Co-Author', CONTRIBUTOR = 'Contributor'
}
export class Contributor implements IContributor {
  constructor(
    readonly ethAddress: string,
    readonly fullName: string,
    readonly type: ContributorType,
    readonly email?: string) {
  }
}
