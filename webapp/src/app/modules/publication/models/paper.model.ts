import { Contributor } from "./contributor.model";

export interface IAsset {
  readonly ethAddress: string
  readonly contributors: Contributor[]
}

class AssetFile implements IAsset {
  public readonly ethAddress: string;
  public readonly fileName: string;
  public readonly fileSystemName: string;
  public readonly publicLocation: string;
  public readonly summaryHashAlgorithm: string;
  public readonly summaryHash: string;
  public readonly contributors: Contributor[];

  constructor(
    ethAddress: string,
    fileName: string,
    fileSystemName: string,
    publicLocation: string,
    hashAlgorithm: string,
    hash: string,
    contributors: Contributor[]) {

    this.ethAddress = ethAddress;
    this.fileName = fileName;
    this.fileSystemName = fileSystemName;
    this.publicLocation = publicLocation;
    this.summaryHashAlgorithm = hashAlgorithm;
    this.summaryHash = hash;
    this.contributors = contributors;
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
    contributors: Contributor[]) {

    super(ethAddress, fileName, fileSystemName, publicLocation, hashAlgorithm, hash, contributors);
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
      this.contributors
    )
  }
}
