import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { prices } from '../utils';

export default function SearchScreen() {
  const [alert, setAlert] = useState({});

  const {
    name = 'all',
    category = 'all',
    min = 0,
    max = 0,
  } = useParams();

  const { products, loading, error } = useSelector(
    (state) => state.productsList
  );

  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = useSelector((state) => state.productsCategory);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchProducts({
        name: name !== 'all' ? name : '',
        category: category !== 'all' ? category : '',
        min,
        max,
      })
    );

    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  }, [dispatch, name, error, category, min, max]);

  const getFilterUrl = (filter) => {
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max || max;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}`;
  };

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

                <div>
                  <h3>Deparment</h3>
                  <ul>
                    <li>
                      {loadingCategories && <LoadingBox />}
                      {errorCategories && (
                        <MessageBox alert={{ msg: errorCategories }} />
                      )}
                      {categories && (
                        <ul>
                          {categories.map((c) => (
                            <li key={c}>
                              <Link
                                className={c === category ? 'active' : ''}
                                to={getFilterUrl({ category: c })}
                              >
                                {c}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3>Price</h3>
                  <ul>
                    {prices.map((p) => (
                      <li key={p.name}>
                        <Link
                          to={getFilterUrl({ min: p.min, max: p.max })}
                          className={
                            `${p.name}-${p.max}` === `${min}-${max}`
                              ? 'active'
                              : ''
                          }
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
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
