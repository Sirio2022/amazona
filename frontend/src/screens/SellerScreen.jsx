import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsUser } from '../redux/userDetailSlice';
import Product from '../components/Product';
import { fetchProducts } from '../redux/productsSlice';

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
    dispatch(fetchProducts({ seller: id }));

    if (errorProducts) {
      setAlert({ msg: errorProducts, error: true });
    }

    if (error) {
      setAlert({ msg: error, error: true });
    }
  }, [dispatch, id, error, errorProducts]);

  const { msg } = alert;

  return (
    <div className="row top">
      <div className="col-1">
        {loading && <LoadingBox />}
        {msg && <MessageBox alert={alert} />}
        {seller && (
          <ul className="card card-body">
            <li>
              <div className="row start">
                <div className="p-1">
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    className="small"
                  ></img>
                </div>
                <div className="p-1">
                  <h1>{seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating rating={seller.rating} numReviews={seller.numReviews} />
            </li>
            <li>
              <Link to={`mailto:${user.email}}`}>Contact Seller</Link>
            </li>
            <li>{seller.description}</li>
          </ul>
        )}
      </div>
      <div className="col-3">
        {loadingProducts && <LoadingBox />}
        {msg && <MessageBox alert={alert} />}
        {errorProducts && <MessageBox alert={alert} />}
        {products && (
          <>
            <div className="row center">
              {products.map((product) => (
                <Product product={product} key={product._id} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
