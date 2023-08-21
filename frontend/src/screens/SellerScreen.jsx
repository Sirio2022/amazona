import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SellerScreen() {
  const [alert, setAlert] = useState({});

  const { user, loading, error } = useSelector((state) => state.userDetails);
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = useSelector((state) => state.productList);

  const { sellerId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsUser(userId));
    dispatch(listProducts({ seller: sellerId }));

    if (error) {
      setAlert({ msg: error, error: true });
    }
  }, [dispatch, sellerId, error]);

  const { msg } = alert;

  return (
    <div className="row top">
      <div className="col-1">
        {loading ? (
          <LoadingBox />
        ) : msg ? (
          <MessageBox alert={alert} />
        ) : (
          <ul className="card card-body">
            <li>
              <div className="row">
                <div>
                  <img src={user.seller.logo} alt={user.seller.name}></img>
                </div>
                <div>
                  <h1>{user.seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                value={user.seller.rating}
                text={`${user.seller.numReviews} reviews`}
              />
            </li>
            <li>
              <Link to={`mailto:${user.email}}`}>Contact Seller</Link>
            </li>
            <li>{user.seller.description}</li>
          </ul>
        )}
      </div>
      <div className="col-3"></div>
    </div>
  );
}
