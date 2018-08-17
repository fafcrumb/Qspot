import { QueuespotElement, html } from './queuespot-element.js';

class QueuespotSwitch extends QueuespotElement {

  static get properties() {
    return {
      selected: String,
      attributeForSelected: String
    };
  }

  constructor() {
    super();

    this.selected = '';
    this.attributeForSelected = 'name';
    this.selectedItem = null;
    this.itemMap = {};
  }

  ready() {
    super.ready();
    const slottedNodes = this.$('slot').assignedNodes();
    for (const node of slottedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const name = node.getAttribute(this.attributeForSelected);
        name && (this.itemMap[name] = node);
      }
    }
    this._requestRender();
  }

  _render(props) {
    const item = this.itemMap[this.selected];
    if (item) {
      item.classList.add('selected');
      this.selectedItem && this.selectedItem.classList.remove('selected');
      this.selectedItem = item;
    }

    return html`
      <style>
        :host {
          display: block;
          contain: content
        }

        :host > ::slotted(:not(slot):not(.selected)) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>
    `;
  }

}
customElements.define('queuespot-switch', QueuespotSwitch);