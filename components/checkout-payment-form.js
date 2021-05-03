import { LitElement, html, css } from '@lion/core';
import { ajax } from '@lion/ajax';
import './checkout-select-bankaccount';

export class CheckoutPaymentForm extends LitElement {

  static get styles() {
    return css`
      :host .alert {
        border: grey;
        padding: 5px;
      }

      .alert-danger {
        background-color: #fab1b1;
      }
    `
  }

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
      totalPrice: {
        type: Number,
      }
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
   * When property update, check if selected account has been changed.
   * If no balance, disable next button.
   * @param {Map} changedProperties 
   */
  update(changedProperties) {
    super.update(changedProperties);

    // changedProperties is Map type.
    if (changedProperties.has('selectedAccount')) {
      const nameEvent = this.hasBalance() ? 'enableNextStep' : 'disableNextStep';

      this.dispatchEvent(new CustomEvent(nameEvent, {
        composed: true,
      }));
    }
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

      this.hasBalance();

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

  /**
   * Is balance on selected bank account sufficient.
   * @returns {Boolean}
   */
  hasBalance() {
    return this.totalPrice < this.selectedAccount.balance;
  }

  render() {
    return html`
      <link rel="stylesheet" href="../node_modules/flexboxgrid/css/flexboxgrid.css" type="text/css"> 
      <div class="row">
        <div class="col-xs-12">
          <h1>Choose a payment method</h1>
          <hr>
          <checkout-select-bank-account 
            .options=${this.accounts} 
          >
          </checkout-select-bank-account>
          <p><span>The balance for this account is: </span><span><strong>${this.selectedAccount && this.selectedAccount.balance}</strong></span></p>

          ${this.selectedAccount && !this.hasBalance() ? html `
            <div class="col-md-6 alert alert-danger">Unsufficient balance. Please select a different account</div>
          ` : html``}
        </div>
      </div>
    `;
  }
}

customElements.define('checkout-payment-form', CheckoutPaymentForm);
