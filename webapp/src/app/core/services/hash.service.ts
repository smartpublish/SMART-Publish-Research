import {Injectable} from "@angular/core";
import blake2b from 'blake2b';
import {Buffer} from 'buffer';
import {FilesService} from "@app/core/services/files.service";

export type Hash = {
  hashAlgorithm: string,
  hash: string
}

@Injectable({providedIn: 'root'})
export class HashService {

  private files: FilesService;

  constructor(filesService: FilesService) {
    this.files = filesService;
  }

  hash(file: File): Hash {
    let instance = blake2b(blake2b.BYTES_MAX);
    let buffer = Buffer.alloc(blake2b.BYTES_MAX);
    let hash = this.files.read(file, 25000, instance.update, () => {
      return instance.digest(buffer).toString('hex')
    });
    return {hashAlgorithm: 'blake2b', hash: hash}
  }


}
