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
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { useEffect, useState } from 'react';
import { fetchCategories } from './redux/categoryListSlice';
import MessageBox from './components/MessageBox';
import LoadingBox from './components/LoadingBox';
import MapScreen from './screens/MapScreen';
import DashBoardScreen from './screens/DashBoardScreen';
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';

function App() {
  const [alert, setAlert] = useState({});
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.signin);

  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = useSelector((state) => state.productsCategory);

  if (errorCategories) {
    setAlert({
      msg: errorCategories,
      error: true,
    });
  }

  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signout());
    dispatch(clearItems());
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const { msg } = alert;

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
              <button
                type="button"
                className="open-sidebar"
                onClick={() => setSidebarIsOpen(true)}
              >
                <i
                  className="fa fa-bars"
                  onClick={() => setSidebarIsOpen(true)}
                ></i>
              </button>
              <Link className="brand" to="/">
                amazona
              </Link>
            </div>

            <div>
              <SearchBox />
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
                    <li>
                      <Link to="/support">Support</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </header>

          <aside className={sidebarIsOpen ? 'open' : ''}>
            <ul className="categories">
              <li>
                <strong>Categories</strong>
                <button
                  onClick={() => setSidebarIsOpen(false)}
                  className="close-sidebar"
                  type="button"
                >
                  <i className="fa fa-close">
                    <Link to="/"></Link>
                  </i>
                </button>
              </li>
              {loadingCategories && <LoadingBox />}
              {msg && <MessageBox alert={alert} />}
              {categories && (
                <ul>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        to={`/search/category/${c}`}
                        onClick={() => setSidebarIsOpen(false)}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </ul>
          </aside>

          <main>
            <Routes>
              <Route path="/seller/:id" element={<SellerScreen />} />
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
              <Route path="/search/name/:name?" element={<SearchScreen />} />
              <Route
                path="/search/category/:category?"
                element={<SearchScreen />}
              />
              <Route
                path="/search/category/:category?/name/:name?"
                element={<SearchScreen />}
              />
              <Route
                path="/search/category/:category?/name/:name?/min/:min?/max/:max?/rating/:rating?/order/:order?/pageNumber/:pageNumber?"
                element={<SearchScreen />}
              />

              <Route path="/profile/" element={<PrivateRoute />}>
                <Route index element={<ProfileScreen />} />
              </Route>
              <Route path="/map" element={<PrivateRoute />}>
                <Route index element={<MapScreen />} />
              </Route>
              {/* Admin Routes*/}
              <Route path="/productlist" element={<AdminRoute />}>
                <Route index element={<ProductListScreen />} />
              </Route>
              <Route
                path="/productlist/pageNumber/:pageNumber"
                element={<AdminRoute />}
              >
                <Route index element={<ProductListScreen />} />
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
              <Route path="/dashboard" element={<AdminRoute />}>
                <Route index element={<DashBoardScreen />} />
              </Route>
              <Route path="/support" element={<AdminRoute />}>
                <Route index element={<SupportScreen />} />
              </Route>
              {/* End of Admin Routes*/}

              {/* Seller Routes*/}
              <Route path="/productlist/seller" element={<SellerRoute />}>
                <Route index element={<ProductListScreen />} />
              </Route>
              <Route path="/orderlist/seller" element={<SellerRoute />}>
                <Route index element={<OrderListScreen />} />
              </Route>
              {/* End of Seller Routes*/}

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </main>

          <footer className="row center">
            <div>

            {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
            </div>
            <div>All rights reserved 2023. </div>
          </footer>
        </div>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
