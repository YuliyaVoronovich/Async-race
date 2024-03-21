import { BaseComponent } from '../components/base-component';

export default class Page extends BaseComponent {
  constructor() {
    super({ tagName: 'main', className: 'main' });
    const buttonWrapper = new BaseComponent({
      tagName: 'div',
      className: 'button-wrapper',
    });
    this.append(buttonWrapper);
  }

  public setContent(section: BaseComponent): void {
    this.replaceChild(section);
  }
}
