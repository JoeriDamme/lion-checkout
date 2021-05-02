import { LitElement, html, css } from '@lion/core';

export class CheckoutConfirmation extends LitElement {
  static get styles() {
    return css`
      :host table {
        width: 100%;
        max-width: 100%;
      }

      :host table img {
        border: 1px solid #d9d9d9;
      }

      :host table img {
        width: 150px;
      }
    `;
  }

  static get properties() {
    return {
      basketData: {
        type: Object
      },
      address: {
        type: Object
      }
    }
  }

  constructor() {
    super();
    this.basketData = {};
  }

  render() {
    return html`
      <link rel="stylesheet" href="../node_modules/flexboxgrid/css/flexboxgrid.css" type="text/css">
      <h1>Thank you for your order!</h1>
      <h2>Here is a summary of your order:</h2>
      <div class="row">
        <div class="col-xs-12 col-md-8">
          <table>
            <tbody>
              ${this.basketData.basket && this.basketData.basket.map(item => html`
              <tr>
                <td><img src="./img${item.mediaUrl}" /></td>
                <td>
                  <div><strong>${item.title}</strong></div>
                  <div><small>Quantity: ${item.quantity}</small></div>
                </td>
                <td>${item.price}</td>
              </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>

      <h2>Your order will be send to:</h2>
    `;
  }
}

customElements.define('checkout-confirmation', CheckoutConfirmation);
