import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { fetchProductDetails } from '../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createReviewAction, reviewReset } from '../redux/reviewSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ProductScreen() {
  const [alert, setAlert] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [qty, setQty] = useState(1);

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const { error, loading, product } = useSelector(
    (state) => state.productDetails
  );

  const {
    loading: loadingReview,
    success: successReview,
    error: errorReview,
    review,
  } = useSelector((state) => state.review);

  const { userInfo } = useSelector((state) => state.signin);

  const dispatch = useDispatch();

  useEffect(() => {
    if (successReview) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: ` ${review.msg}`,
      });
    }
    setRating(0);
    setComment('');

    dispatch(reviewReset());
    dispatch(fetchProductDetails(id));
  }, [dispatch, id, successReview, review.msg]);

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`);
  };

  const { msg } = alert;

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReviewAction(id, { rating, comment, name: userInfo.name })
      );
      if (errorReview) {
        setAlert({ msg: errorReview, error: true });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, comment and rate the product!',
      });
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox alert={alert} />
      ) : !product || !review || !product.seller ? (
        <MessageBox alert={{ msg: 'Product not found' }} />
      ) : (
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
                      <Link to={`/seller/${product.seller._id}`}>
                        {product.seller.seller.name}
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
          <div>
            <h2 id="reviews">Reviews</h2>
            {!product.reviews ||
              (!product.reviews.length && (
                <MessageBox alert={{ msg: 'No Reviews' }} />
              ))}
            {product.reviews && (
              <ul>
                {product.reviews.map((review) => (
                  <li key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} caption=" " />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
                <li>
                  {userInfo.name ? (
                    <form onSubmit={submitHandler} className="form">
                      <div>
                        <h2>Write a customer review</h2>
                      </div>
                      <div>
                        <label htmlFor="rating">Rating</label>
                        <select
                          id="rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1- Poor</option>
                          <option value="2">2- Fair</option>
                          <option value="3">2 -Good</option>
                          <option value="4">3 - Very Good</option>
                          <option value="5">4 - Excellent</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="comment">Coment</label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>
                      <div>
                        <label />
                        <button className="primary" type="submit">
                          Submit
                        </button>
                      </div>
                      <div>
                        {loadingReview && <LoadingBox />}
                        {msg && <MessageBox alert={alert} />}
                      </div>
                    </form>
                  ) : (
                    <div>
                      <MessageBox
                        alert={{
                          msg: 'Please, Sign In to write a review',
                          link2: true,
                        }}
                      />
                    </div>
                  )}
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
