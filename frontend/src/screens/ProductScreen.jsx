import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating';

import { fetchProductDetails } from '../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductScreen() {
  const [alert, setAlert] = useState({});
  const [preloaded, setPreloaded] = useState(false);

  const [qty, setQty] = useState(1);

  const navigate = useNavigate();
  const params = useParams();

  const { error, loading, product } = useSelector(
    (state) => state.productDetails
  );

  const { seller } = product;
  const { seller: sellerInfo } = seller;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!preloaded) {
      dispatch(fetchProductDetails(params.id));
      setPreloaded(true);
    }

    if (error) {
      setAlert({ msg: error, error: true });
    }
  }, [dispatch, error, loading, params.id, preloaded]);

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`);
  };

  const { msg } = alert;

  return (
    <div>
      {loading && <LoadingBox />}
      {msg && <MessageBox alert={alert} />}
      {preloaded &&  (
        <div>
          <Link to="/">Back to result</Link>
          <div className="row top">
            <div className="col-2">
              <img className="large" src={product.image} alt={product.name} />
            </div>

            <div className="col-1">
              <ul>
                <li>{product.name}</li>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </li>
                <li>Price: ${product.price}</li>
                <li>
                  Description:
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>

            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    Seller
                    <h2>
                      <Link to={`/seller/${seller._id}`}>
                        {sellerInfo.name}
                      </Link>
                    </h2>
                  </li>
                  <li>
                    <div className="row">
                      <div>Price</div>
                      <div className="price">${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Status:</div>{' '}
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">In Stock</span>
                        ) : (
                          <span className="danger">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </li>

                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Qty</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="primary block"
                        >
                          Add to Cart
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
