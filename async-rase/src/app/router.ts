import type { BaseComponent } from './components/base-component';
import type Page from './pages/page';

// const mapRoutes = {
//   '/garage': import('./pages/garage-page/garage-page'),
//   '/winners': import('./pages/winners-page/winners-page'),
// } as const;

export default class Router {
  constructor(private routerOutlet: Page) {
    window.addEventListener('hashchange', this.handleLocationChange.bind(this));
    this.handleLocationChange();
  }

  public handleLocationChange(): void {
    // const pathname = window.location.hash.slice(1);
    // const currentPath = `/${pathname}`;
    const currentPath = '/garage';

    this.setViewContent(currentPath)
      .then((data) => {
        this.routerOutlet.setContent(data);
      })
      .catch(() => {});
  }

  private setViewContent = async (location: string): Promise<BaseComponent> => {
    const { GaragePage } = await import('./pages/garage-page/garage-page');
    return new GaragePage();
  };

  // private setViewContent = async (location: keyof typeof mapRoutes): Promise<BaseComponent> => {
  //   const { GaragePage } = await mapRoutes[location];
  //   return new GaragePage();
  // };
}
