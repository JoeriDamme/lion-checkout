import { LitElement, html } from '@lion/core';

export class CheckoutPaymentForm extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <p>payment form</p>
    `;
  }
}

customElements.define('checkout-payment-form', CheckoutPaymentForm);
