import { LionSteps } from '@lion/steps';

export class CheckoutSteps extends LionSteps {
  static get styles() {
    return [
      super.styles,
    ]
  }
}

customElements.define('checkout-steps', CheckoutSteps);
