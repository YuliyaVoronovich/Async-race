import { BaseComponent } from '../components/base-component';
import { Button } from '../components/button/button';

export default class Page extends BaseComponent {
  private section: BaseComponent;

  constructor() {
    super({ tagName: 'main', className: 'main' });
    this.section = new BaseComponent({
      tagName: 'section',
      className: 'page-section',
    });
    const buttonWrapper = new BaseComponent(
      {
        tagName: 'aside',
        className: 'button-wrapper',
      },
      this.createButtonGarage(),
      this.createButtonWinners(),
    );
    this.appendChildren([buttonWrapper, this.section]);
  }

  private createButtonGarage() {
    return new Button({
      className: 'form-button game-button',
      textContent: 'Garage',
      onClick: (): void => {
        window.location.href = `#garage`;
      },
    });
  }

  private createButtonWinners() {
    return new Button({
      className: 'form-button game-button',
      textContent: 'Winners',
      onClick: (): void => {
        window.location.href = `#winners`;
      },
    });
  }

  public setContent(section: BaseComponent): void {
    this.section.replaceChild(section);
  }
}
