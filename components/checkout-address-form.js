import { LitElement, html } from '@lion/core';

export class CheckoutAddressForm extends LitElement {

  /**
   * Get properties.
   */
  static get properties() {
    return {
      data: {
        type: Object
      }
    }
  }

  constructor() {
    super();
  }


  /**
   * Check if form is valid.
   * @returns {Boolean}
   */
  validate() {
    const inputs = this.shadowRoot.querySelectorAll('lion-input');
    // want to have access to the every method on array, which is not present in NodeList
    const inputsArr = Array.from(inputs);

    // if no errors in every lion input, the form is valid
    return inputsArr.every(el => Object.keys(el.__validationStates.error).length === 0);
  }

  render() {
    return html`
      <p>Address Form</p>
    `;
  }
}

customElements.define('checkout-address-form', CheckoutAddressForm);
