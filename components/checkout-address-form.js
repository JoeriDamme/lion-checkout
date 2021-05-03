import { LitElement, html } from '@lion/core';
import { Required, IsEmail } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { ajax } from '@lion/ajax';
import '@lion/input/define';
import '@lion/fieldset/define';
import '@lion/form/define';

export class CheckoutAddressForm extends LitElement {

  /**
   * Get properties.
   */
  static get properties() {
    return {
      onlyVoucher: {
        type: Boolean
      }
    }
  }

  constructor() {
    super();
    loadDefaultFeedbackMessages();
    this.onlyVoucher = false;
    this.data = {};
    this.formData = {
      street: '',
      houseNumber: '',
      houseNumberAddition: '',
      postalCode: '',
      city: '',
      email: '',
    }
  }

  async firstUpdated() {
    try {
      this.data = await this.fetchPersonalDetails();
      this.setFormdata();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Get personal details.
   * @returns Promise<object>
   */
  async fetchPersonalDetails() {
    const response = await ajax.requestJson('../mock-data-address.json');
    return response.body;
  }

  /**
   * Get an address from the address array by index.
   * @param {Number} index 
   * @returns {Object} address of client.
   */
  getAddress(index) {
    const result = this.data.addresses[index];

    if (!result) {
      // TODO: handle error in FE.
      throw new Error(`No address found on index: ${index}`);
    }

    return result;
  }
  
  /**
   * Format the form data.
   */
  setFormdata() {
    const address = this.getAddress(0);
    this.formData = {
      street: address.street,
      houseNumber: address.houseNumber,
      houseNumberAddition: address.houseNumberAddition,
      postalCode: address.postalCode,
      city: address.city,
      email: this.data.personalEmailAddress,
    }

    // trigger render
    this.requestUpdate();
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

  /**
   * Handle the input changes.
   */
  handleChange() {
    // @model-value-changed is fired while rendering?
    // let's wait for data.
    if (Object.keys(this.data).length === 0 && this.data.constructor === Object) {
      return;
    }

    const valid = this.validate();
    const nameEvent = valid ? 'enableNextStep' : 'disableNextStep';

    this.formData = {
      street: this.shadowRoot.querySelector('lion-input[name=street]').value,
      houseNumber: this.shadowRoot.querySelector('lion-input[name=houseNumber]').value,
      houseNumberAddition: this.shadowRoot.querySelector('lion-input[name=houseNumberAddition]').value,
      postalCode: this.shadowRoot.querySelector('lion-input[name=postalCode]').value,
      city: this.shadowRoot.querySelector('lion-input[name=city]').value,
      email: this.shadowRoot.querySelector('lion-input[name=email]').value,
    }

    this.dispatchEvent(new CustomEvent(nameEvent, {
      composed: true,
    }));
  }

  render() {
    return html`
      <link rel="stylesheet" href="../node_modules/flexboxgrid/css/flexboxgrid.css" type="text/css"> 
      <h1>Shipping Address</h1>
      <div class="row">
        <div class="col-xs-12">
          <lion-form>
            <form>
              <lion-fieldset name="checkoutAddress">
                <lion-input
                  .hidden=${this.onlyVoucher}
                  name="street"
                  label="Street" 
                  .modelValue=${this.formData.street}
                  @model-value-changed=${() => this.handleChange()}
                  .validators="${[new Required()]}"
                >
                </lion-input>
                <lion-input
                  .hidden=${this.onlyVoucher}
                  name="houseNumber"
                  label="House Number"
                  .modelValue=${this.formData.houseNumber}
                  @model-value-changed=${() => this.handleChange()}
                  .validators="${[new Required()]}"
                >
                </lion-input>
                <lion-input
                  .hidden=${this.onlyVoucher}
                  name="houseNumberAddition" label="House Number Addition" 
                  @model-value-changed=${() => this.handleChange()}
                  .modelValue=${this.formData.houseNumberAddition}>
                </lion-input>
                <lion-input
                  .hidden=${this.onlyVoucher}
                  name="postalCode"
                  label="Postal Code" 
                  .modelValue=${this.formData.postalCode}
                  @model-value-changed=${() => this.handleChange()}
                  .validators="${[new Required()]}">
                </lion-input>
                <lion-input
                  .hidden=${this.onlyVoucher}
                  name="city"
                  label="City"
                  .modelValue=${this.formData.city}
                  @model-value-changed=${() => this.handleChange()}
                  .validators="${[new Required()]}">
                </lion-input>
                <lion-input
                  name="email"
                  label="Email Address"
                  .modelValue=${this.formData.email}
                  @model-value-changed=${() => this.handleChange()}
                  .validators="${[new Required(), new IsEmail() ]}">
                </lion-input>
              </lion-fieldset>
            </form>
          </lion-form>
        </div>
      </div>
    `;
  }
}

customElements.define('checkout-address-form', CheckoutAddressForm);
