import { LitElement, html } from '@lion/core';

export class CheckoutConfirmation extends LitElement {
  render() {
    return html`
      <p>confirmation</p>
    `;
  }
}

customElements.define('checkout-confirmation', CheckoutConfirmation);
