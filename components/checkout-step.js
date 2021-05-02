import { LionStep } from '@lion/steps';
import  '../utils/iconset-checkout';
import { icons } from '@lion/icon';
import { css, html } from '@lion/core';


export class CheckoutStep extends LionStep {

  /**
   * Define icons used for rendering the status.
   */
  static checkCircleIconFill = icons.resolveIcon('lion', 'checkoutIcons', 'check-circle-fill');
  static circleIcon = icons.resolveIcon('lion', 'checkoutIcons', 'circle');
  static arrowDownCircle = icons.resolveIcon('lion', 'checkoutIcons', 'arrow-down-circle');

  /**
   * Get properties.
   */
  static get properties() {
    return {
      name: {
        type: String,
      },
      hideStripe: {
        type: Boolean,
      }
    }
  }

  /**
   * Define styles.
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host, :host([status="entered"])  {
          display: inline-block;
          color: #FF6200;
          font-size: 12px;
        }

        :host svg {
          height: 32px;
          width: 32px;
        }

        :host .checkout-step-icon {
          width: 64px;
          text-align: center;
        }

        :host .checkout-step-container {
          display: flex;
          flex-direction: row;
        }

        :host .checkout-step-stripe-draw {
          border-bottom: 2px solid #FF6200;
          width: 100px;
          margin-top: 14px;
        }
      `,
    ]
  }

  constructor() {
    super();
    this.hideStripe = false;
  }

  /**
   * Render HTML based on status of the step.
   * @returns TemplateResult
   */
  render() {
    let icon = CheckoutStep.circleIcon;
    switch(this.status) {
      case 'left':
      case 'skipped':
        icon = CheckoutStep.checkCircleIconFill;
        break;      
      case 'entered':
        icon = CheckoutStep.arrowDownCircle;
    }

    return html`
      <div class="checkout-step-container">
        <div class="checkout-step-icon">${icon}<br/>${this.name}</div>
        <div ?hidden=${this.hideStripe} class="checkout-step-stripe">
          <div class="checkout-step-stripe-draw"></div>
        </div>
      </div>`;
  }
}

customElements.define('checkout-step', CheckoutStep);
