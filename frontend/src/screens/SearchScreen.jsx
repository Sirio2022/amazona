import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';

export default function SearchScreen() {
  const [alert, setAlert] = useState({});

  const { name = 'all' } = useParams();

  const { products, loading, error } = useSelector(
    (state) => state.productsList
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({ name: name !== 'all' ? name : '' }));

    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  }, [dispatch, name, error]);

  const { msg } = alert;

  return (
    <div>
      {loading && <LoadingBox />}
      {msg && <MessageBox alert={alert} />}
      {products.length === 0 ? (
        <MessageBox alert={{ msg: 'No Products Found' }} />
      ) : (
        <>
          
          <div>
            <div className="row top">
              <div className="col-1">
              <div className="row">{products.length} Results</div>
                <h3>Deparment</h3>
                <ul>
                  <li>Category 1</li>
                </ul>
              </div>
              <div className="col-3">
                {loading && <LoadingBox />}
                {msg && <MessageBox alert={alert} />}
                <div className="row">
                  {products && (
                    <div className="row center ">
                      {products.map((product) => (
                        <Product product={product} key={product._id} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
