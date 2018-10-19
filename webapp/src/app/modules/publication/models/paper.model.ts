import {hash} from "@app/support/Hash";


export interface IAsset {

}

class AssetFile implements IAsset {
  ethAddress: number;
  fileName: string;
  file: File;
  fileSystemName: string;
  publicLocation: string;
  summaryHashAlgorithm: string;
  summaryHash: string;

  constructor(file?: File, fileSystemName?: string, publicLocation?: string, ethAddress?: number) {
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
  title: string;
  abstract: string;

  constructor(
    title: string,
    abstract: string,
    file?: File,
    fileSystemName?: string,
    publicLocation?: string,
    ethAddress?: number){

    super(file, publicLocation, fileSystemName, ethAddress);
    this.title = title;
    this.abstract = abstract;
  }

}
