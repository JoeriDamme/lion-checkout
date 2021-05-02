import { LitElement, css, html } from '@lion/core';

export class CheckoutOverview extends LitElement {

  // Steps that are required to go forward in flow.
  static steps = ['Overview', 'Address', 'Payment', 'Confirmation'];

  static get styles() {
    return css`
      :host img {
        width: 150px;
      }

      :host .card {
        padding: 10px;
      }

      :host .card-dark {
        background-color: #d9d9d9;
      }

      :host table {
        width: 100%;
        max-width: 100%;
      }

      :host table img {
        border: 1px solid #d9d9d9;
      }
    `
  }

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
    this.data = {};
  }

  render() {
    return html`
    <link rel="stylesheet" href="../node_modules/flexboxgrid/css/flexboxgrid.css" type="text/css">
    <div class="row">
      <div class="col-xs-12 col-md-8">
        <div class="card">
          <h1>Overview</h1>
          <hr>
          <table>
            <tbody>
              ${this.data.basket && this.data.basket.map(item => html`
              <tr>
                <td><img src="./img${item.mediaUrl}" /></td>
                <td>
                  <div><strong>${item.title}</strong></div>
                  <div><small>Quantity: ${item.quantity}</small></div>
                </td>
                <td>${item.price}</td>
                <td>delete</td>
              </tr>
              `)}
            </tbody>
          </table>
        </div>  
      </div>
      <div class="col-xs-12 col-md-4">
        <div class="card card-dark">
          <h1>Summary</h1>
          <div>
            <strong>Subtotal (# item)</strong>
            <div><span>Points:</span><span>${this.data.basketSummary && this.data.basketSummary.price}</span></div>
          </div>
          <div>
            <strong>Extra Costs</strong>
            <div><span>Points:</span><span>${this.data.basketSummary && this.data.basketSummary.extraCostValue}</span></div>
            <hr>
          </div>
          <div>
            <strong>Order Total</strong>
            <div><span>Points:</span><span>${this.data.basketSummary && this.data.basketSummary.totalPrice}</span></div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('checkout-overview', CheckoutOverview);
