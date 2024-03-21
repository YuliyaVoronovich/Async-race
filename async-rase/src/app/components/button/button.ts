// import './button.css';
import { BaseComponent } from '../base-component';

interface IButton {
  className: string;
  textContent?: string;
  onClick?: (e: Event) => void;
}

export class Button extends BaseComponent {
  constructor({ className, textContent, onClick }: IButton) {
    super({
      tagName: 'button',
      className,
      textContent,
    });
    if (onClick) {
      this.addListener('click', onClick);
    }
  }
}
