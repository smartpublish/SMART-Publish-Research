import { Contributor } from './contributor.model'
import { Set } from 'immutable'

export interface IAsset {
  readonly ethNetwork: string
  readonly ethAddress: string
  readonly contributors: Set<Contributor>
  readonly ownerAddress: string
}

export type PaperJson = {
  ethNetwork: string
  ethAddress: string
  title: string
  summary: string
  abstract: string
  fileName: string
  fileSystemName: string
  publicLocation: string
  summaryHashAlgorithm: string
  summaryHash: string
  topic: string
  keywords: Set<string>
  contributors: Set<Contributor>
  ownerAddress: string
}

class PaperBuilder {
  private json: PaperJson
  constructor(paper?: Paper) {
    this.json = paper ? paper.toJSON() : <PaperJson>{}
  }
  ethNetwork(ethNetwork: string): PaperBuilder{
    this.json.ethNetwork = ethNetwork
    return this
  }
  ethAddress(ethAddress: string): PaperBuilder {
    this.json.ethAddress = ethAddress
    return this
  }
  title(title: string): PaperBuilder {
    this.json.title = title
    return this
  }
  summary(summary: string): PaperBuilder {
    this.json.summary = summary
    return this
  }
  abstract(abstract: string): PaperBuilder {
    this.json.abstract = abstract
    return this
  }
  fileName(fileName: string): PaperBuilder {
    this.json.fileName = fileName
    return this
  }
  fileSystemName(fileSystemName: string): PaperBuilder {
    this.json.fileSystemName = fileSystemName
    return this
  }
  publicLocation(publicLocation: string): PaperBuilder {
    this.json.publicLocation = publicLocation
    return this
  }
  summaryHashAlgorithm(summaryHashAlgorithm: string): PaperBuilder {
    this.json.summaryHashAlgorithm = summaryHashAlgorithm
    return this
  }
  summaryHash(summaryHash: string): PaperBuilder {
    this.json.summaryHash = summaryHash
    return this
  }
  topic(topic: string): PaperBuilder {
    this.json.topic = topic
    return this
  }
  keywords(keywords: Set<string>): PaperBuilder {
    this.json.keywords = keywords
    return this
  }
  contributors(contributors: Set<Contributor>): PaperBuilder {
    this.json.contributors = contributors
    return this
  }
  ownerAddress(ownerAddress: string): PaperBuilder {
    this.json.ownerAddress = ownerAddress
    return this
  }
  build(): Paper {
    return Paper.fromJSON(this.json)
  }
}

export class Paper implements IAsset {

  private constructor (
    readonly ethNetwork: string,
    readonly ethAddress: string,
    readonly title: string,
    readonly summary: string,
    readonly abstract: string,
    readonly fileName: string,
    readonly fileSystemName: string,
    readonly publicLocation: string,
    readonly summaryHashAlgorithm: string,
    readonly summaryHash: string,
    readonly topic: string,
    readonly keywords: Set<string>,
    readonly contributors: Set<Contributor>,
    readonly ownerAddress: string
  ) { }
  
  toJSON(): PaperJson {
    return {
      ethNetwork: this.ethNetwork,
      ethAddress: this.ethAddress,
      title: this.title,
      summary: this.summary,
      abstract: this.abstract,
      fileName: this.fileName,
      fileSystemName: this.fileSystemName,
      publicLocation: this.publicLocation,
      summaryHashAlgorithm: this.summaryHashAlgorithm,
      summaryHash: this.summaryHash,
      topic: this.topic,
      keywords: this.keywords,
      contributors: this.contributors,
      ownerAddress: this.ownerAddress
    }
  }
    
  static fromJSON(json: PaperJson): Paper {
    return new Paper(
      json.ethNetwork,
      json.ethAddress,
      json.title,
      json.summary,
      json.abstract,
      json.fileName,
      json.fileSystemName,
      json.publicLocation,
      json.summaryHashAlgorithm,
      json.summaryHash,
      json.topic,
      json.keywords,
      json.contributors,
      json.ownerAddress
    )
  }

  static builder(paper?: Paper): PaperBuilder {
    return new PaperBuilder(paper)
  }
}