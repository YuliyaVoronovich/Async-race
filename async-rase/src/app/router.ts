import type { BaseComponent } from './components/base-component';
import type Page from './pages/page';

const mapRoutes = {
  '': () => import('./pages/garage-page/garage-page').then((item) => item.GaragePageInstanse),
  garage: () => import('./pages/garage-page/garage-page').then((item) => item.GaragePageInstanse),
  winners: () => import('./pages/winners-page/winners-page').then((item) => item.WinnersPageInstanse),
};

type Route = keyof typeof mapRoutes;

function isValidRoute(route: string): route is Route {
  return Object.keys(mapRoutes).includes(route);
}

export default class Router {
  constructor(private routerOutlet: Page) {
    window.addEventListener('hashchange', this.handleLocationChange.bind(this));
    this.handleLocationChange();
  }

  public handleLocationChange(): void {
    const pathname = window.location.hash.slice(1);

    if (!isValidRoute(pathname)) {
      return;
    }

    this.setViewContent(pathname)
      .then((data) => {
        this.routerOutlet.setContent(data);
      })
      .catch(() => {});
  }

  private setViewContent = async (location: keyof typeof mapRoutes): Promise<BaseComponent> => {
    const Page = await mapRoutes[location]();
    return Page;
  };
}
