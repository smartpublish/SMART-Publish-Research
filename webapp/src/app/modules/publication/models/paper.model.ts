import blake2b from 'blake2b';
import { Buffer } from 'buffer';
import StreamBuffers from 'stream-buffers';

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

  constructor(file?: File, fileSystemName?: string, publicLocation?: string, summaryHashAlgorithm?: string,
    summaryHash?: string,  ethAddress?: string) {
    
    this.fileSystemName = fileSystemName;
    this.publicLocation = publicLocation;
    this.summaryHashAlgorithm = summaryHashAlgorithm;
    this.summaryHash = summaryHash;
    this.ethAddress = ethAddress;

    if(file) {
      this.file = file;
      this.fileName = file.name;
      this.calculateSummaryHash();
    }
  }

  private calculateSummaryHash():void {
      let instance = blake2b(blake2b.BYTES_MAX);

      let fileReader = new FileReader();
      fileReader.onload = (event) => {
        let arrayBuffer = event.target['result'];

        const myReadableStreamBuffer = new StreamBuffers.ReadableStreamBuffer({
          chunkSize: 25000
        });

        myReadableStreamBuffer.on('readable', (data) => {
          let chunk;
          while((chunk = myReadableStreamBuffer.read()) !== null) {
            instance.update(chunk);
          }
        });

        myReadableStreamBuffer.on('end', () => {
          this.summaryHash = instance.digest(Buffer.alloc(blake2b.BYTES_MAX)).toString('hex');
          this.summaryHashAlgorithm = 'blake2b';
        });

        myReadableStreamBuffer.put(arrayBuffer);
        myReadableStreamBuffer.stop();
      };

      fileReader.readAsArrayBuffer(this.file);
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
    summaryHashAlgorithm?: string,
    summaryHash?: string,
    ethAddress?: string){

    super(file, fileSystemName, publicLocation, summaryHashAlgorithm, summaryHash, ethAddress);
    this.title = title;
    this.abstract = abstract;
  }

}
