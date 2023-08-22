import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser } from '../redux/userDetailSlice';

export default function SellerScreen() {
  const { id } = useParams();

  const [alert, setAlert] = useState({});

  const { user, loading, error } = useSelector((state) => state.userDetails);
  const { seller } = user;

  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = useSelector((state) => state.productsList);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsUser(id));
    //dispatch(listProducts({ seller: sellerId }));

    if (error) {
      setAlert({ msg: error, error: true });
    }
  }, [dispatch, error, id]);

  const { msg } = alert;

  return (
    <div className="row top">
      <div className="col-1">
        {loading && <LoadingBox />}
        {msg && <MessageBox alert={alert} />}
        {seller && (
          <ul className="card card-body">
            <li>
              <div className="row">
                <div>
                  <img src={seller.logo} alt={seller.name} className='small'></img>
                </div>
                <div>
                  <h1>{seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                rating={seller.rating}
                numReviews={seller.numReviews}
              />
            </li>
            <li>
              <Link to={`mailto:${user.email}}`}>Contact Seller</Link>
            </li>
            <li>{seller.description}</li>
          </ul>
        )}
      </div>
      <div className="col-3"></div>
    </div>
  );
}
