import { Injectable } from '@angular/core'
import { Buffer } from 'buffer'
import IPFS from 'ipfs'
import { bs58 } from 'bs58'
import StreamBuffers from 'stream-buffers'

@Injectable()
export class IpfsService {
  node: any
  progress: number
  stream: any

  constructor() {
    // Create an IPFS node
    this.node = new IPFS({
      repo: 'ipfs-smart-papers'
    })

    this.node.on('ready', () => console.log('Online status: ', this.node.isOnline() ? 'online' : 'offline'))
  }

  upload(fileObj: [File]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.progress = 0
      const myReadableStreamBuffer = new StreamBuffers.ReadableStreamBuffer({
        chunkSize: 25000   // determines data transfer rate
      })
      this.stream = this.node.files.addReadableStream()

      this.stream.on('data', (file) => {
        resolve(file.hash)

        this.node.pin.ls((err, pins) => {
          if (err) {
            throw err
          }
          console.log(pins)
        })
        this.node.swarm.peers((err, peerInfos) => {
          if (err) {
            throw err
          }
          console.log(peerInfos)
        })
      })
      myReadableStreamBuffer.on('data', (chunk) => {
        this.progress += chunk.byteLength
        myReadableStreamBuffer.resume()
      })

      this.stream.write(myReadableStreamBuffer)
      myReadableStreamBuffer.put(Buffer.from(fileObj))
      myReadableStreamBuffer.stop()

      myReadableStreamBuffer.on('end', () => {
        this.stream.end()
      })
    })
  }

}
