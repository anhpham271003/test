import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home/Home';
import Order from '~/pages/Order';
import Profile from '~/pages/Profile';
import Address from '~/pages/Address';
import Search from '~/pages/Search';
import ProductDetail from '~/pages/ProductDetail';
import AddProduct from '~/pages/AddProduct';
import UpdateProduct from '~/pages/UpdateProduct';
import Category from '~/pages/Category';
// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.order, component: Order },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.address, component: Address, layout: HeaderOnly },
    { path: config.routes.search, component: Search },
    { path: config.routes.productDetail, component: ProductDetail },
    { path: config.routes.addProduct, component: AddProduct },
    { path: config.routes.updateProduct, component: UpdateProduct },
    { path: config.routes.category, component: Category },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
