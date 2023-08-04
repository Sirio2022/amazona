import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { OrderDetailsAction } from '../redux/orderDetailsSlice';
import PaypalCheckoutButton from '../components/PaypalCheckoutButton';

export default function OrderScreen() {
  const [alert, setAlert] = useState('');
  const params = useParams();

  const { orderdetails, success, loading, error } = useSelector(
    (state) => state.orderDetails
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (success || orderdetails._id !== params.id) {
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
    params.id,
    error,
    orderdetails.msg,
    orderdetails._id,
    success,
    orderdetails.isPaid,
  ]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox alert={alert} />
  ) : (
    <div>
      {orderdetails && orderdetails.order && (
        <div>
          <h1>Order {orderdetails.order._id}</h1>
          <div>
            <div className="row top">
              <div className="col-2">
                <ul>
                  <li>
                    <div className="card card-body">
                      <h2>Shipping</h2>
                      <p>
                        <strong>
                          Name: {orderdetails.order.shippingAddress.fullName}{' '}
                          <br />
                          Address: {
                            orderdetails.order.shippingAddress.address
                          }, {orderdetails.order.shippingAddress.city},{' '}
                          {orderdetails.order.shippingAddress.postalCode},{' '}
                          {orderdetails.order.shippingAddress.country}
                        </strong>
                      </p>
                      {orderdetails.order.isDelivered ? (
                        <MessageBox
                          alert={{ msg: 'Delivered', error: false }}
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
                        <strong>
                          Method: {orderdetails.order.paymentMethod}
                        </strong>
                      </p>
                      {orderdetails.order.isPaid ? (
                        <MessageBox
                          alert={{
                            msg: `Paid at: ${orderdetails.order.paidAt}`,
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
                        {orderdetails.order.orderItems.map((item) => (
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
                        <div>${orderdetails.order.itemsPrice.toFixed(2)}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Shipping</div>
                        <div>
                          ${orderdetails.order.shippingPrice.toFixed(2)}
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>Tax</div>
                        <div>${orderdetails.order.taxPrice.toFixed(2)}</div>
                      </div>
                    </li>
                    <li>
                      <div className="row">
                        <div>
                          <strong>Order Total</strong>
                        </div>
                        <div>
                          <strong>
                            ${orderdetails.order.totalPrice.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </li>
                    <li>
                      {error && (
                        <MessageBox alert={{ msg: error, error: true }} />
                      )}
                      {loading && <LoadingBox />}
                      {!orderdetails.order.isPaid && (
                        <PaypalCheckoutButton order={orderdetails.order} />
                      )}
                    </li>
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
