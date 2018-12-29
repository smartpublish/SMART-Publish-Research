import { Contributor } from "./contributor.model";

export interface IAsset {
  readonly ethAddress: string
  readonly contributors: Contributor[]
  readonly ownerAddress: string
}

class AssetFile implements IAsset {
  public readonly ethAddress: string;
  public readonly fileName: string;
  public readonly fileSystemName: string;
  public readonly publicLocation: string;
  public readonly summaryHashAlgorithm: string;
  public readonly summaryHash: string;
  public readonly contributors: Contributor[];
  public readonly ownerAddress: string;

  constructor(
    ethAddress: string,
    fileName: string,
    fileSystemName: string,
    publicLocation: string,
    hashAlgorithm: string,
    hash: string,
    contributors: Contributor[],
    ownerAddress: string) {

    this.ethAddress = ethAddress;
    this.fileName = fileName;
    this.fileSystemName = fileSystemName;
    this.publicLocation = publicLocation;
    this.summaryHashAlgorithm = hashAlgorithm;
    this.summaryHash = hash;
    this.contributors = contributors;
    this.ownerAddress = ownerAddress;
  }

}

export class Paper extends AssetFile {
  public readonly title: string;
  public readonly abstract: string;

  constructor(
    title: string,
    abstract: string,
    ethAddress: string,
    fileName: string,
    fileSystemName: string,
    publicLocation: string,
    hashAlgorithm: string,
    hash: string,
    contributors: Contributor[],
    ownerAddress: string) {

    super(ethAddress, fileName, fileSystemName, publicLocation, hashAlgorithm, hash, contributors, ownerAddress);
    this.title = title;
    this.abstract = abstract;
  }

  copy(
    fileSystemName?: string,
    publicLocation?: string,
  ): Paper {
    return new Paper(
      this.title,
      this.abstract,
      this.ethAddress,
      this.fileName,
      fileSystemName? fileSystemName : this.fileSystemName,
      publicLocation? publicLocation : this.publicLocation,
      this.summaryHashAlgorithm,
      this.summaryHash,
      this.contributors,
      this.ownerAddress
    )
  }
}
