import { LitElement, html, css } from '@lion/core';
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

  static get styles() {
    return css`
      :host .checkout-content {
        margin-bottom: 10px;
      }
    `
  }

  /**
   * Get properties.
   */
  static get properties() {
    return {
      basketData: {
        type: Object
      },
      currentStep: {
        type: Number
      },
      disableButton: {
        type: Boolean
      },
    }
  }

  constructor() {
    super();
    this.basketData = {};
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
      <checkout-overview .data=${this.basketData}></checkout-overview>
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
   * Sort array by key. Native solution from Lodash.
   * @param {string} key 
   * @returns {Array} sorted array by key.
   */
  sortBy(arr, key) {
    return arr.concat().sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
  }

  /**
   * Get the basket data on load.
   */
  async firstUpdated() {
    try {
      const data = await this.fetchBasket();
      // sort on fulfillmentType
      data.basket = this.sortBy(data.basket, 'fulfillmentType');
      this.basketData = data;
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }

  isBasketEmpty() {
    const result =  this.basketData && this.basketData.basket && !this.basketData.basket.length;
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
        ${this.currentStep === 0 && this.isBasketEmpty() ? html`
          <p>Nothing in basket</p>
          <checkout-button @click=${() => alert('back to homepage')}>Go back to homepage</checkout-button>
        ` : this.getHtmlStep()}
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
