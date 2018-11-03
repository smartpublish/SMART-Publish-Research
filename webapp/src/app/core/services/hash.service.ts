import {Injectable} from "@angular/core";
import blake2b from 'blake2b';
import {Buffer} from 'buffer';
import {FileService} from "@app/core/services/file.service";

export type Hash = {
  hashAlgorithm: string,
  hash: string
}

@Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor(private filesService: FileService) {
  }

  hash(file: File): Promise<Hash> {
    return new Promise((resolve, reject) => {
      try {
        let instance = blake2b(blake2b.BYTES_MAX);
        let buffer = Buffer.alloc(blake2b.BYTES_MAX);
        this.filesService.read(file, 25000, instance.update.bind(instance), () => {
          let hash = instance.digest(buffer).toString('hex');
          resolve({hashAlgorithm: 'blake2b', hash: hash});
        });
      } catch(error) {
        reject(error);
      }
    });
  }


}
