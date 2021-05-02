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
    }
  }

  constructor() {
    super();
    this.accounts = [];
  }

  /**
   * Get the basket data on load.
   */
  async firstUpdated() {

    // fetch all required information for checkout.
    try {
      const result = await this.fetchBankAccounts();
      this.accounts = result.accounts;
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
          >
          </checkout-select-bank-account>
        </div>
      </div>
    `;
  }
}

customElements.define('checkout-payment-form', CheckoutPaymentForm);
