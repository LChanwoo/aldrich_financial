/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

interface IRoute{
  path?: string
  icon?: string
  name: string
  routes?: IRoute[]
  checkActive?(pathname: String, route: IRoute): boolean
  exact?: boolean
}

export function routeIsActive (pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route)
  }

  return route?.exact
    ? pathname == route?.path
    : (route?.path ? pathname.indexOf(route.path) === 0 : false)
}

const routes: IRoute[] = [
  {
    path: '/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: '대쉬보드', // name that appear in Sidebar
    exact: true,
  },
  {
    path: '/portfolio',
    icon: 'ChartsIcon',
    name: '포트폴리오',
  },
  {
    path: '/myhistory',
    icon: 'ChartsIcon',
    name: '내거래기록',
  },
  {
    path: '/ranking',
    icon: 'CardsIcon',
    name: '투자순위',
  },
  {
    path: '/news',
    icon: 'CardsIcon',
    name: '코인뉴스',
  },
  // {
  //   path: '/news',
  //   icon: 'FormsIcon',
  //   name: 'Forms',
  // },
  // {
  //   path: '/example/charts',
  //   icon: 'ChartsIcon',
  //   name: 'Charts',
  // },
  // {
  //   path: '/example/buttons',
  //   icon: 'ButtonsIcon',
  //   name: 'Buttons',
  // },
  // {
  //   path: '/example/modals',
  //   icon: 'ModalsIcon',
  //   name: 'Modals',
  // },
  // {
  //   path: '/example/tables',
  //   icon: 'TablesIcon',
  //   name: 'Tables',
  // },
  // {
  //   icon: 'PagesIcon',
  //   name: 'Pages',
  //   routes: [
  //     // submenu
  //     {
  //       path: '/example/login',
  //       name: 'Login',
  //     },
  //     {
  //       path: '/example/create-account',
  //       name: 'Create account',
  //     },
  //     {
  //       path: '/example/forgot-password',
  //       name: 'Forgot password',
  //     },
  //     {
  //       path: '/example/404',
  //       name: '404',
  //     },
  //     {
  //       path: '/example/blank',
  //       name: 'Blank',
  //     },
  //   ],
  // },
]

export type {IRoute}
export default routes
