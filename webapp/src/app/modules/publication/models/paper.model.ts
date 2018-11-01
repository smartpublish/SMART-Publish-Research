import {hash} from "@app/support/Hash";


export interface IAsset {

}

class AssetFile implements IAsset {
  ethAddress: string;
  fileName: string;
  file: File;
  fileSystemName: string;
  publicLocation: string;
  summaryHashAlgorithm: string;
  summaryHash: string;

  constructor(file?: File, fileSystemName?: string, publicLocation?: string, ethAddress?: string) {
    if(file) {
      this.file = file;
      this.fileName = file.name;
      var hash = hash(file);
      this.summaryHashAlgorithm = hash.hashAlgorithm;
      this.summaryHash = hash.hash;
    }

    this.fileSystemName = fileSystemName;
    this.publicLocation = publicLocation;
    this.ethAddress = ethAddress;
  }

}

export class Paper extends AssetFile {
  public title: string;
  public abstract: string;

  constructor(
    title: string,
    abstract: string,
    file?: File,
    fileSystemName?: string,
    publicLocation?: string,
    ethAddress?: string){

    super(file, publicLocation, fileSystemName, ethAddress);
    this.title = title;
    this.abstract = abstract;
  }

}
