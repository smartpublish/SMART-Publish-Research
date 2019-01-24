import { IAsset } from './paper.model'

export interface Invitation {

}

export interface ContributorInvitation extends Invitation {
  guest: {
    email: string
  },
  asset: IAsset,
  code: string
  token: string,
  link: string,
  link_mailto: string,
  expires: Date,
  created: Date,
  hashCode: string
}
