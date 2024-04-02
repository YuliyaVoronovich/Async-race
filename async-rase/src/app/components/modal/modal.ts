import './modal.scss';

import { BaseComponent } from '../base-component';
import { Button } from '../button/button';

export class Modal extends BaseComponent {
  private modalWrapper = new BaseComponent({ tag: 'div', className: 'modal-wrapper' });

  private modalContent = new BaseComponent({ tag: 'div', className: 'modal-content' });

  private modalText = new BaseComponent({ tag: 'div', className: 'modal-text' });

  protected closeButton = new Button({ className: 'modal-button', textContent: 'OK' });

  constructor() {
    super({ tag: 'div', className: 'modal' });

    this.modalContent.appendChildren([this.modalText, this.closeButton]);
    this.modalWrapper.appendChildren([this.modalContent]);
    this.appendChildren([this.modalWrapper]);
    this.closeButton.addListener('click', () => {
      this.modalWrapper.toggleClass('open');
    });
  }

  public set content(text: string) {
    this.modalText.setHTML(text);
  }

  public toggleModal() {
    this.modalWrapper.toggleClass('open');
  }
}
