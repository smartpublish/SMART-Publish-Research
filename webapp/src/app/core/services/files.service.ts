import {Injectable} from "@angular/core";
import StreamBuffers from 'stream-buffers';

@Injectable()
export class FilesService {

  read<R>(file: File, chunkSize: number, onChunk: (data) => {}, onFinish: () => R): R {
    let returnValue: R = null;
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      const myReadableStreamBuffer = new StreamBuffers.ReadableStreamBuffer({chunkSize: chunkSize});

      myReadableStreamBuffer.on('readable', (data) => {
        let chunk;
        while ((chunk = myReadableStreamBuffer.read()) !== null) {
          onChunk(data)
        }
      });


      myReadableStreamBuffer.on('end', () => {
        returnValue = onFinish()
      });

      myReadableStreamBuffer.put(event.target.result);
      myReadableStreamBuffer.stop();
    };

    fileReader.readAsArrayBuffer(file);
    return returnValue
  }


}
