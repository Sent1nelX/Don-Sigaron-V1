import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import About from '../pages/About';
import Contacts from '../pages/Contacts';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Admin from '../pages/Admin';
import Profile from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:id', element: <ProductDetails /> },
      { path: 'about', element: <About /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'admin', element: <Admin /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]);