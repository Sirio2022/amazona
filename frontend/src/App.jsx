import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { signout } from './redux/signinSlice';
import { clearItems } from './redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import ForgotPassword from './screens/ForgotPassword';
import RegisterScreen from './screens/RegisterScreen';
import NewPassword from './screens/NewPassword';
import AccountConfirm from './screens/AccountConfirm';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/orderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListSellerScreen from './screens/ProductListSellerScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import ProductListAdminScreen from './screens/ProductListAdminScreen';

function App() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.signin);

  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signout());
    dispatch(clearItems());
  };

  return (
    <PayPalScriptProvider
      options={{
        'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
      }}
    >
      <BrowserRouter>
        <div className="grid-container">
          <header className="row">
            <div>
              <Link className="brand" to="/">
                amazona
              </Link>
            </div>

            <div>
              <Link to="/cart">
                Cart
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>
              {userInfo.name ? (
                <div className="dropdown">
                  <Link to="#">
                    {userInfo.name} <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/profile">User Profile</Link>
                    </li>

                    <li>
                      <Link to="/orderhistory">Order History</Link>
                    </li>
                    <li>
                      <Link to="/" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
              {userInfo.name && userInfo.isSeller && (
                <div className="dropdown">
                  <Link to="#seller">
                    Seller <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/productlist/seller">Products</Link>
                      <li>
                        <Link to="/orderlist/seller">Orders</Link>
                      </li>
                    </li>
                  </ul>
                </div>
              )}
              {userInfo.name && userInfo.isAdmin && (
                <div className="dropdown">
                  <Link to="#admin">
                    Admin <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/productlist">Products</Link>
                    </li>
                    <li>
                      <Link to="/orderlist">Orders</Link>
                    </li>
                    <li>
                      <Link to="userList">Users</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </header>

          <main>
            <Routes>
              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} exact />
              <Route path="/product/:id/edit" element={<ProductEditScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password/:token" element={<NewPassword />} />
              <Route path="/confirm/:id" element={<AccountConfirm />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile/" element={<PrivateRoute />}>
                <Route index element={<ProfileScreen />} />
              </Route>
              {/* Admin Routes*/}
              <Route path="/productlist" element={<AdminRoute />}>
                <Route index element={<ProductListAdminScreen />} />
              </Route>
              <Route path="/orderlist" element={<AdminRoute />}>
                <Route index element={<OrderListScreen />} />
              </Route>
              <Route path="/userlist" element={<AdminRoute />}>
                <Route index element={<UserListScreen />} />
              </Route>
              <Route path="/user/:id/edit" element={<AdminRoute />}>
                <Route index element={<UserEditScreen />} />
              </Route>
              {/* End of Admin Routes*/}

              {/* Seller Routes*/}
              <Route path="/productlist/seller" element={<SellerRoute />}>
                <Route index element={<ProductListSellerScreen />} />
              </Route>
              <Route path="/orderlist/seller" element={<SellerRoute />}>
                <Route index element={<OrderListScreen />} />
              </Route>
              {/* End of Seller Routes*/}

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </main>

          <footer className="row center">All rights reserved 2023.</footer>
        </div>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
