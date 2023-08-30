import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderSummary } from '../redux/orderSummarySlice';
import Chart from 'react-google-charts';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { formatoMoneda } from '../helpers/currencyFormat';

export default function DashBoardScreen() {
  const { summary, loading, error } = useSelector(
    (state) => state.orderSummary
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderSummary());
  }, [dispatch]);

  const total = summary.orders
    ? summary.dailyOrders.reduce((a, c) => a + c.sales, 0)
    : 0;

  return (
    <div>
      <div className="row">
        <h1>Dashboard</h1>
      </div>
      {loading && <LoadingBox />}
      {error && <MessageBox alert={alert} />}
      {summary.orders && (
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
              <div className="summary-body">{formatoMoneda(total)}</div>
            </li>
          </ul>
          <div>
            <div>
              <h2>Sales</h2>
              {summary.dailyOrders && summary.dailyOrders.length === 0 ? (
                <MessageBox alert={{ msg: 'No Sale', error: false }} />
              ) : (
                <Chart
                  width={'100%'}
                  height={'400px'}
                  chartType="AreaChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Date', 'Sales'],
                    ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                  ]}
                />
              )}
            </div>
            <div>
              <h2>Categories</h2>
              {summary.productCategories && summary.productCategories.length === 0 ? (
                <MessageBox alert={{ msg: 'No Categories', error: false }} />
              ) : (
                <Chart
                  width={'100%'}
                  height={'400px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Category', 'Products'],
                    ...summary.productCategories.map((x) => [x._id, x.count]),
                  ]}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
