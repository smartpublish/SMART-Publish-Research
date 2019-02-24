import { HomeModule } from './home/home.module'
import { PublicationModule } from './publication/publication.module'
import { MyWorkModule } from './my-work/my-work.module'

export const features = [
  HomeModule,
  PublicationModule,
  MyWorkModule
]

export * from './home/home.module'
export * from './publication/publication.module'
export * from './my-work/my-work.module'
