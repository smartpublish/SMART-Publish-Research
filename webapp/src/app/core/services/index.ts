import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';
import { ContributorService } from './contributor.service';
import { EthereumService } from './ethereum.service';
import { FileService } from './file.service';
import { HashService } from './hash.service'; 
import { IpfsService } from './ipfs.service';

export const services = [
  AlertService,
  AuthenticationService,
  ContributorService,
  EthereumService,
  FileService,
  HashService,
  IpfsService
];

export * from './alert.service';
export * from './authentication.service';
export * from './contributor.service';
export * from './ethereum.service';
export * from './file.service';
export * from './hash.service';
export * from './ipfs.service';
