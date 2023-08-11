import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../redux/orderListSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteOrder, deleteOrderReset } from '../redux/deleteOrderSlice';

export default function OrderListScreen() {
  const [alert, setAlert] = useState({});

  const { orderList, loading, error } = useSelector((state) => state.orderList);
  const { orders } = orderList;

  const {
    success: successDelete,
    loading: loadindDelete,
    error: errorDelete,
  } = useSelector((state) => state.orderDelete);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(deleteOrderReset());
    dispatch(listOrders());

    if (errorDelete) {
      setAlert({ msg: errorDelete, error: true });
    }
  }, [dispatch, successDelete, errorDelete]);

  const deleteHandler = (order) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it!',
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#2196f3',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', `${order._id} has been deleted.`, 'success');
        dispatch(deleteOrder(order._id));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', `${order._id} is safe.`, 'error');
      }
    });
  };

  return (
    <div>
      <div>
        <h1>Orders</h1>
        {loadindDelete && <LoadingBox />}
        {errorDelete && <MessageBox alert={alert} />}

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox alert={{ msg: error, error: true }} />
        ) : (
          <div>
            {orderList.length === 0 ? (
              <MessageBox alert={{ msg: orderList.msg, error: true }} />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                      </td>
                      <td>
                        {order.isDelivered
                          ? order.deliverdAt.substring(0, 10)
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
                        <button
                          type="button"
                          className="small"
                          onClick={() => deleteHandler(order)}
                        >
                          Delete
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
    </div>
  );
}
