import { LitElement, html } from 'lit-element';
import { ajax } from '@lion/ajax';
import './components/checkout-overview';

class LionCheckout extends LitElement {
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

  render() {
    return html`
      <checkout-overview .data=${this.basket}></checkout-overview>
    `
  }
}

customElements.define('lion-checkout', LionCheckout);
