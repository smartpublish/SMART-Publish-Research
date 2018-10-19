import blake2b from 'blake2b';
import {Buffer} from 'buffer';
import {read} from "@app/support/Files";

export type Hash = {
  hashAlgorithm: string,
  hash: string
}

export function hash(file: File): Hash {
  let instance = blake2b(blake2b.BYTES_MAX);
  let buffer = Buffer.alloc(blake2b.BYTES_MAX)
  let hash = read(file, 25000, instance.update, () => {
    return instance.digest(buffer).toString('hex')
  });
  return {hashAlgorithm: 'blake2b', hash: hash}
}

