import { createBrowserHistory } from 'history';

// const isModifiedEvent = (event: any) => !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

// const isLeftClickEvent = (event: any) => event.button === 0;

class AppRouter {
  router: any;
  history = createBrowserHistory({
    basename: ''
  });

  getHistory() {
    return this.history;
  }

  registerRouter(reactRouter: any) {
    this.router = reactRouter;
  }

  appPath({ path }: { path?: string } = {}) {
    return path
      ? `/${path.replace(/^\//, '')}` // Remove preceding slash from path if present
      : `/`;
  }

  public navigateToApp({ path }: { path?: string } = {}) {
    // basePath not needed here because `history` is configured with basename
    this.history!.push(this.appPath({ path }));
  }
}

const AppRouterService = new AppRouter();
export default AppRouterService;

// export const getRouterLinkProps = (to: any) => {
//   const location = typeof to === 'string' ?
//     createLocation(to, undefined, undefined, router.history.location) :
//     to;

//   const href = router.history.createHref(location);

//   const onClick = (event: any) => {
//     if (event.defaultPrevented) {
//       return;
//     }

//     // If target prop is set (e.g. to "_blank"), let browser handle link.
//     if (event.target.getAttribute('target')) {
//       return;
//     }

//     if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
//       return;
//     }

//     // Prevent regular link behavior, which causes a browser refresh.
//     event.preventDefault();
//     router.history.push(location);
//   };

//   return {href, onClick}
// }
