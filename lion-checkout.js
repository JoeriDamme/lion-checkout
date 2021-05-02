import { LitElement, html } from '@lion/core';
import './components/checkout-overview';
import './components/checkout-steps';
import './components/checkout-step';
import './components/checkout-button';
import './components/checkout-address-form';
import './components/checkout-payment-form';
import './components/checkout-confirmation';
import { ajax } from '@lion/ajax';

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
      currentStep: {
        type: Number
      },
      disableButton: {
        type: Boolean
      }
    }
  }

  constructor() {
    super();
    this.basket = {};
    this.currentStep = 0;
    this.disableButton = false;

    this.addEventListener('disableNextStep', () => {
      this.disableButton = true;
    });

    this.addEventListener('enableNextStep', () => {
      this.disableButton = false;
    });
  }

    /**
   * Load the HTML for the current step in the checkout flow.
   * @returns TemplateResult
   */
  getHtmlStep() {
    let result = html`
      <checkout-overview .data=${this.basket}></checkout-overview>
    `;

    switch(this.currentStep) {
      case 1: 
        result = html`
          <checkout-address-form></checkout-address-form>
        `;
        break;
      case 2: 
        result = html`
          <checkout-payment-form></checkout-payment-form>
        `;
        break;
      case 3: 
        result = html`
          <checkout-confirmation></checkout-confirmation>
        `;
        break;
    }

    return result;
  }


  handlePreviousStepClick() {
    const checkoutSteps = this.shadowRoot.querySelector('checkout-steps');
    // go to previous step
    checkoutSteps.previous();
    // update property currentStep
    this.currentStep = checkoutSteps.current;
  }

  handleNextStepClick() {
    const checkoutSteps = this.shadowRoot.querySelector('checkout-steps');
    // go to next step
    checkoutSteps.next();
    // update property currentStep
    this.currentStep = checkoutSteps.current;
  }

  /**
   * Get the basket data on load.
   */
  async firstUpdated() {
    try {
      this.basket = await this.fetchBasket()
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }

  isBasketEmpty() {
    const result =  this.basket && this.basket.basket && !this.basket.basket.length;
    this.disableButton = result;
    return result;
  }

  /**
   * Get basket content.
   * @returns Promise<object>
   */
  async fetchBasket() {
    const response = await ajax.requestJson('../mock-data.json');
    return response.body;
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

      <div class="checkout-content">
        ${this.isBasketEmpty() ? html`<p>Nothing in basket</p>` : this.getHtmlStep()}
      </div>

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
          ${this.currentStep === 2 ? `Confirm` : `Next` }
        </checkout-button>
      </div>
    `
  }
}

customElements.define('lion-checkout', LionCheckout);
