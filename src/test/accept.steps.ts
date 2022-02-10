import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'chai'
import { binding, given, then, when } from 'cucumber-tsflow';
import { parseAccept } from '../util/parse-accept';

@binding()
export class AcceptSteps {
  currentAccept: string;
  result: { type: string; }[];

  @given('an accept value of {string}')
  async anAcceptValueOf(accept: string) {
    this.currentAccept = accept
  }

  @when('the accept value is parsed')
  async theAcceptValueIsParsed() {
    this.result = parseAccept(this.currentAccept)
  }

  @then('the following is returned:')
  async theFollowingIsReturned(documentString) {
    expect(this.result).to.deep.equal(JSON.parse(documentString))
  }
}
