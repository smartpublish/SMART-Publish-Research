import { PublicationModule } from './publication.module';

describe('PublicationModule', () => {
  let publicationModule: PublicationModule;

  beforeEach(() => {
    publicationModule = new PublicationModule();
  });

  it('should create an instance', () => {
    expect(publicationModule).toBeTruthy();
  });
});
