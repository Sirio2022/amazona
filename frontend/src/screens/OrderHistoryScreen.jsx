import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useEffect } from 'react';
import { listOrderHistory } from '../redux/orderHistorySlice';
import { useNavigate } from 'react-router-dom';

export default function OrderHistoryScreen() {
  const { orderHistory, loading, error } = useSelector(
    (state) => state.orderHistory
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrderHistory());
  }, [dispatch]);

  return (
    <div>
      <h1>Order History</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox alert={{ msg: error, error: true }} />
      ) : (
        <div>
          {orderHistory.length === 0 ? (
            <MessageBox alert={{ msg: 'No Order Found', error: true }} />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                    </td>
                    <td>
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : 'No'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
