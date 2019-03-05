import { browser, by, element, ElementFinder } from 'protractor';

export class SubmitPage {
  navigateTo() {
    return browser.get('#/submit');
  }

  getTitle(): ElementFinder {
    return element(by.css('h1'));
  }

  getLoginButton(): ElementFinder {
    return element(by.id('loginButton'))
  }
}
