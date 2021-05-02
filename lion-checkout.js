import { LitElement, html } from '@lion/core';
import { ajax } from '@lion/ajax';
import './components/checkout-overview';
import './components/checkout-steps';
import './components/checkout-step';
import './components/checkout-button';

class LionCheckout extends LitElement {

  /**
   * Steps needed to go through the flow.
   */
  static steps = ['Overview', 'Address', 'Payment', 'Confirmation'];

  /**
   * Get properties.
   */
  static get properties() {
    return {
      basket: {
        type: Object
      },
    }
  }

  constructor() {
    super();
    this.basket = {};
  }

  /**
   * Get basket content.
   * @returns Promise<object>
   */
  async fetchBasket() {
    const response = await ajax.requestJson('./mock-data.json');
    return response.body;
  }


  /**
   * Get the basket data on load.
   */
   async firstUpdated() {
    try {
      this.basket = await this.fetchBasket();
      console.log(this.basket);
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }


  handlePreviousStepClick() {
    // do something
  }

  handleNextStepClick() {
    // do something
  }

  render() {
    return html`
      <div class="row col-xs-12">
        <checkout-steps>
          ${LionCheckout.steps.map((stepName, i) => html`
            <checkout-step name="${stepName}" ?initial-step=${!i} ?hideStripe=${i === LionCheckout.steps.length - 1}></checkout-step>
          `)}
        </checkout-steps>
      </div>
      <checkout-overview .data=${this.basket}></checkout-overview>

      <div class="row col-xs-12 checkout-buttons">
        <checkout-button
          @click=${() => this.handlePreviousStepClick()}
          ?hidden=${!this.currentStep}
        >
          Previous
        </checkout-button>

        <checkout-button
          @click=${() => this.handleNextStepClick()}
          ?disabled=${this.disableButton}
          ?hidden=${this.currentStep === LionCheckout.steps.length - 1}
        >
          Next
        </checkout-button>
      </div>
    `
  }
}

customElements.define('lion-checkout', LionCheckout);
