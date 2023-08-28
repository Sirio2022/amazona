import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { prices, ratings } from '../utils';
import Rating from '../components/Rating';

export default function SearchScreen() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({});

  const {
    category = 'all',
    name = 'all',
    min = 0,
    max = 0,
    rating = 0,
    order = 'all',
    pageNumber = 1,
  } = useParams();

  const { products, page, pages, loading, error } = useSelector(
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
        category: category !== 'all' ? category : '',
        name: name !== 'all' ? name : '',
        min,
        max,
        rating,
        order,
        pageNumber,
      })
    );

    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  }, [dispatch, name, error, category, min, max, rating, order, pageNumber]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
  };

  const { msg } = alert;

  return (
    <div>
      {loading && <LoadingBox />}
      {msg && <MessageBox alert={alert} />}
      {products.length === 0 ? (
        <MessageBox alert={{ msg: 'No Products Found' }} />
      ) : (
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
                        <li>
                          <Link
                            className={'all' === category ? 'active' : ''}
                            to={getFilterUrl({ category: 'all' })}
                          >
                            Any
                          </Link>
                        </li>
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

              <div>
                <h3>Avg. Customer Review</h3>
                <ul>
                  {ratings.map((r) => (
                    <li key={r.name}>
                      <Link
                        to={getFilterUrl({ rating: r.rating })}
                        className={
                          `${r.rating}` === `${rating}` ? 'active' : ''
                        }
                      >
                        <Rating caption={'& up'} rating={r.rating} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-3">
              {loading && <LoadingBox />}
              {msg && <MessageBox alert={alert} />}
              <div className="row sort">
                <label htmlFor="order">Sort by</label>
                <select
                  name="order"
                  id="order"
                  value={order}
                  onChange={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="toprated">Avg: Customer Reviews</option>
                </select>
              </div>
              <div>
                {products && (
                  <div className="row center">
                    {products.map((product) => (
                      <Product product={product} key={product._id} />
                    ))}
                  </div>
                )}

                <div className="pagination row center">
                  {[...Array(pages).keys()].map((x) => (
                    <Link
                      className={x + 1 === page ? 'active' : ''}
                      key={x + 1}
                      to={getFilterUrl({ page: x + 1 })}
                    >
                      {x + 1}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
