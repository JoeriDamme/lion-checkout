import { LitElement, html } from '@lion/core';
import * as ibantools from 'ibantools';
import '@lion/select-rich/define';
import '@lion/listbox/define';

export class CheckoutSelectBankAccount extends LitElement {
  /**
   * Get properties.
   */
  static get properties() {
    return {
      options: {
        type: Array
      }
    }
  } 

  constructor() {
    super();
    this.options = [];
  }

  render() {
    return html`
    <lion-select-rich name="selectBankAccount" label="Select Bank Account">
      ${this.options.map((option) => html`
        <lion-option .choiceValue=${option.accountId}>
          <strong>${option.name}</strong><br>${ibantools.friendlyFormatIBAN(option.iban)}
        </lion-option>
      `)}
    </lion-select-rich>
    `
  }
}
customElements.define('checkout-select-bank-account', CheckoutSelectBankAccount);
