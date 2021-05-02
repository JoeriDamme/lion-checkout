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

  handleChange() {
    // @model-value-changed is called when element renders. Options are not set.
    if (!this.options.length) {
      return;
    }

    // get element
    const element = this.shadowRoot.querySelector('lion-select-rich');

    // dispatch event, so parent knows the selected item on change.
    this.dispatchEvent(new CustomEvent('changeBankAccount', {
      composed: true,
      detail: {
        index: element.checkedIndex,
        value: this.options[element.checkedIndex],
      }
    }));
  }

  render() {
    return html`
    <lion-select-rich name="selectBankAccount" label="Select Bank Account" @model-value-changed=${() => this.handleChange()}>
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
