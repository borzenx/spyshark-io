import Dashboard from './pages/dashboard';
import SalesTracker from './pages/sales-tracker';
import Store from './pages/store/store';
import Settings from './pages/settings';
import Products from './pages/products';
import TiktokVirals from './pages/tiktok-virals';

// Define your routes here
const routes = [
  {
    name: 'Dashboard',
    path: '/',
    component: Dashboard,
  },
  {
    name: 'Sales Tracker',
    path: '/sales-tracker',
    component: SalesTracker,
  },
  {
    name: 'Store',
    path: '/sales-tracker/store',
    component: Store,
  },
  {
    name: 'Products',
    path: '/products',
    component: Products,
  },
  {
    name: 'Tiktok Virals',
    path: '/tiktok-virals',
    component: TiktokVirals,
  },
  {
    name: 'Settings',
    path: '/settings',
    component: Settings,
  },
];

export default routes;