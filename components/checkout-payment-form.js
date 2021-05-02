import { LitElement, html } from '@lion/core';
import { ajax } from '@lion/ajax';
import './checkout-select-bankaccount';

export class CheckoutPaymentForm extends LitElement {

  /**
   * Get properties.
   */
  static get properties() {
    return {
      accounts: {
        type: Array,
      },
      selectedAccount: {
        type: Object,
      },
    }
  }

  constructor() {
    super();
    this.accounts = [];

    // listen to the changes on the bank account rich select.
    this.addEventListener('changeBankAccount', (e) => {
      const { detail } = e;
      this.selectedAccount = this.accounts.find(account => account.accountId === detail.value.accountId);
    });
  }

  /**
   * Get the basket data on load.
   */
  async firstUpdated() {
    // fetch all required information for checkout.
    try {
      const result = await this.fetchBankAccounts();
      this.accounts = result.accounts;
      // first item in array will be the default selected bank account.
      this.selectedAccount = this.accounts[0];

      // when entering the page, reserve the basket
      this.dispatchEvent(new CustomEvent('reserveBasket', {
        composed: true,
      }));
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }

  /**
   * Get basket content.
   * @returns Promise<object>
   */
  async fetchBankAccounts() {
    const response = await ajax.requestJson('../mock-bank-accounts.json');
    return response.body;
  }

  render() {
    return html`
      <link rel="stylesheet" href="../node_modules/flexboxgrid/css/flexboxgrid.css" type="text/css"> 
      <div class="row">
        <div class="col-xs-12">
          <h1>Choose a payment method</h1>
          <checkout-select-bank-account 
            .options=${this.accounts} 
            .defaultSelect=${0}
          >
          </checkout-select-bank-account>
        </div>
      </div>
    `;
  }
}

customElements.define('checkout-payment-form', CheckoutPaymentForm);
