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
    // data from basket endpoint
    this.basketData = {};

    // keep track of current step
    this.currentStep = 0;

    // disable next button
    this.disableButton = false;

    // will keep track of data of every step
    this.stepData = {};

    this.addEventListener('disableNextStep', () => {
      this.disableButton = true;
    });

    this.addEventListener('enableNextStep', () => {
      this.disableButton = false;
    });

    this.addEventListener('reserveBasket', async () => {
      await this.patchReservationBasket()
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
          <checkout-address-form .onlyVoucher=${this.hasOnlyVoucher()}></checkout-address-form>
        `;
        break;
      case 2: 
        result = html`
          <checkout-payment-form .totalPrice=${this.basketData.basketSummary.totalPrice}></checkout-payment-form>
        `;
        break;
      case 3: 
        result = html`
          <checkout-confirmation .basketData=${this.basketData} .address=${this.stepData.address }></checkout-confirmation>
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

    // get data from every step
    if (this.currentStep === 1) {
      // get address information
      const element = this.shadowRoot.querySelector('checkout-address-form');
      // information is stored in the property formData
      this.stepData['address'] = element.formData;
    }

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

  /**
   * Fake call to reserve basket.
   */
  async patchReservationBasket() {
    try {
      await ajax.request('http://localhost/api/basket/', {
        method: 'PATCH',
        headers: {
          authorization: 'Bearer some_random_jwt',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reserve: true,
        })
      });
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Check if there are only vouchers in basket.
   * @returns {Boolean}
   */
  hasOnlyVoucher() {
    return !this.basketData.basket.filter(item => item.fulfillmentType !== 'VOUCHER').length
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
