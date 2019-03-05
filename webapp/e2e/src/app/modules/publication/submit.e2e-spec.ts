import { SubmitPage } from './submit.po'

describe('Submit a paper', () => {
  let page: SubmitPage

  beforeEach(() => {
    page = new SubmitPage()
  })

  it('should display submit title page', () => {
    page.navigateTo()
    expect(page.getTitle().getText()).toEqual('Publish')
  })

  it('should login in order to submit a paper', () => {
    expect(page.getLoginButton().click)
  })
})
