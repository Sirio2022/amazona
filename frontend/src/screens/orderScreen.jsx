import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { OrderDetailsAction, payOrderReset } from '../redux/orderDetailsSlice';
import PaypalCheckoutButton from '../components/PaypalCheckoutButton';
import { deliverOrder, deliverOrderReset } from '../redux/deliverOrderSlice';

export default function OrderScreen() {
  const [alert, setAlert] = useState('');
  const params = useParams();

  const { orderdetails, success, successPay, loading, error } = useSelector(
    (state) => state.orderDetails
  );
  const { order } = orderdetails;

  const {
    loading: loadingDeliver,
    success: successDeliver,
    error: errorDeliver,
  } = useSelector((state) => state.orderDeliver);

  const { userInfo } = useSelector((state) => state.signin);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!order || successPay || successDeliver || order._id !== params.id) {
      dispatch(payOrderReset());
      dispatch(deliverOrderReset());
      dispatch(OrderDetailsAction(params.id));
    }
    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  }, [
    dispatch,
    order,
    params.id,
    success,
    orderdetails._id,
    error,
    successDeliver,
    successPay,
  ]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox alert={alert} />
  ) : (
    <div>
      {order && (
        <div>
          <h1>Order {order._id}</h1>
          <div>
            <div className="row top">
              <div className="col-2">
                <ul>
                  <li>
                    <div className="card card-body">
                      <h2>Shipping</h2>
                      <p>
                        <strong>
                          Name: {order.shippingAddress.fullName} <br />
                          Address: {order.shippingAddress.address},{' '}
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.postalCode},{' '}
                          {order.shippingAddress.country}
                        </strong>
                        &nbsp;
                        {order.shippingAddress.location &&
                          order.shippingAddress.location.lat && (
                            <Link
                              target='_blank'
                              to={`https://www.google.com/maps/place/${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                            >
                              Show on Map
                            </Link>
                          )}
                      </p>
                      {order.isDelivered ? (
                        <MessageBox
                          alert={{
                            msg: `Delivered at: ${order.deliveredAt.substring(
                              0,
                              10
                            )}`,
                            error: false,
                          }}
                        />
                      ) : (
                        <MessageBox
                          alert={{ msg: 'Not Delivered', error: true }}
                        />
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="card card-body">
                      <h2>Payment</h2>
                      <p>
                        <strong>Method: {order.paymentMethod}</strong>
                      </p>
                      {order.isPaid ? (
                        <MessageBox
                          alert={{
                            msg: `Paid at: ${order.paidAt.substring(0, 10)}`,
                            error: false,
                          }}
                        />
                      ) : (
                        <MessageBox alert={{ msg: 'Not Paid', error: true }} />
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="card card-body">
                      <h2>Order Items</h2>
                      <ul>
                        {order.orderItems.map((item) => (
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
                        <div>${order.itemsPrice.toFixed(2)}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Shipping</div>
                        <div>${order.shippingPrice.toFixed(2)}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Tax</div>
                        <div>${order.taxPrice.toFixed(2)}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>
                          <strong>Order Total</strong>
                        </div>
                        <div>
                          <strong>${order.totalPrice.toFixed(2)}</strong>
                        </div>
                      </div>
                    </li>
                    <li>
                      {error && (
                        <MessageBox alert={{ msg: error, error: true }} />
                      )}
                      {loading && <LoadingBox />}
                      {!order.isPaid && <PaypalCheckoutButton order={order} />}
                    </li>
                    {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                      <li>
                        {loadingDeliver && <LoadingBox />}
                        {errorDeliver && (
                          <MessageBox
                            alert={{ msg: errorDeliver, error: true }}
                          />
                        )}
                        <button
                          type="button"
                          className="primary block"
                          onClick={deliverHandler}
                        >
                          Deliver Order
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
