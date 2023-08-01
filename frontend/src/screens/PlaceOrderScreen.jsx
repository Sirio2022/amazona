import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/orderSlice';
import { clearOrderAction } from '../redux/orderSlice';
import  LoadingBox  from '../components/LoadingBox';
import  MessageBox  from '../components/MessageBox';

export default function PlaceOrderScreen() {

  const [alert, setAlert] = useState('');

  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.shippingAddress);
  const { paymentMethod } = useSelector((state) => state.paymentMethod);
  const { cartItems } = useSelector((state) => state.cart);
  const { order, loading, error, success } = useSelector(
    (state) => state.placeOrder
  );

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, paymentMethod]);

  // Convert price to 2 decimal places
  const toPrice = (num) => Number(num.toFixed(2));
  const itemsPrice = toPrice(
    cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  const shippingPrice = cartItems.price > 100 ? toPrice(0) : toPrice(10);
  const taxPrice = toPrice(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    // create an order
    try {
      dispatch(
        createOrder({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        })
      );
      setAlert({
        msg: order.msg,
        error: false,
      });
      if (error) {
        setAlert({
          msg: error,
          error: true,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if(success) {
      navigate(`/order/${order._id}`)
      dispatch(clearOrderAction())
    }
  }, [ dispatch, navigate, success, order])

  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3 step4 />
      </div>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>
                    Name: {shippingAddress.fullName} <br />
                    Address: {shippingAddress.address}, {shippingAddress.city},{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </strong>
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method: {paymentMethod}</strong>
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>

                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          <strong>
                            {item.qty} Items * ${item.price} = $
                            {item.qty * item.price}
                          </strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  className="primary block"
                  type="button"
                  onClick={placeOrderHandler}
                  disabled={cartItems.length === 0}
                >
                  Place Order
                </button>
              </li>
              {loading && <LoadingBox></LoadingBox>}
              {error && <MessageBox 
                alert={alert}
              />}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
