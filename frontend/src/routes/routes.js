import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home/Home';
import Order from '~/pages/Order';
import Profile from '~/pages/Profile';
import Address from '~/pages/Address';
import Search from '~/pages/Search';
import Live from '~/pages/Live';
import ProductDetail from '~/pages/ProductDetail';
import AddProduct from '~/pages/AddProduct';
import UpdateProduct from '~/pages/UpdateProduct';
// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.order, component: Order },
    { path: config.routes.live, component: Live },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.address, component: Address, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.productDetail, component: ProductDetail },
    { path: config.routes.addProduct, component: AddProduct },
    { path: config.routes.updateProduct, component: UpdateProduct },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
