import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOrderSummary } from '../redux/orderSummarySlice';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function DashBoardScreen() {
  const { summary, loading, error } = useSelector(
    (state) => state.orderSummary
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderSummary());
  }, [dispatch]);

  return (
    <div>
      <div className="row">
        <h1>Dashboard</h1>
      </div>
      {loading && <LoadingBox />}
      {error && <MessageBox alert={alert} />}
      {summary && (
        <>
          <ul className="row summary">
            <li>
              <div className="summary-title color1">
                <span>
                  <i className="fa fa-users" /> Users
                </span>
              </div>
              <div className="summary-body">{summary.users}</div>
            </li>
            <li>
              <div className="summary-title color2">
                <span>
                  <i className="fa fa-cart-plus" /> Orders
                </span>
              </div>
              <div className="summary-body">
                {summary.orders ? summary.orders : 0}
              </div>
            </li>
            <li>
              <div className="summary-title color3">
                <span>
                  <i className="fa fa-money" /> Sales
                </span>
              </div>
              <div className="summary-body">
                {summary.orders
                  ? summary.dailyOrders.reduce((a, c) => a + c.sales, 0)
                  : 0}
              </div>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
