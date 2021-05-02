import { LionButton } from '@lion/button';

export class CheckoutButton extends LionButton {
  static get styles() {
    return [
      super.styles,
    ];
  }

    /**
   * Get properties.
   */
  static get properties() {
    return {
      disabled: {
        type: Boolean
      }
    }
  }

  constructor() {
    super();
  }
}
customElements.define('checkout-button', CheckoutButton);
