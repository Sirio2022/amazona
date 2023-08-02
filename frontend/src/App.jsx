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

function App() {
  const { cartItems } = useSelector((state) => state.cart); // useSelector debe de tener un nivel mas de profundidad por el persistor state.state (ver redux devtools).
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
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </div>
          </header>

          <main>
            <Routes>
              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password/:token" element={<NewPassword />} />
              <Route path="/confirm/:id" element={<AccountConfirm />} />
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
