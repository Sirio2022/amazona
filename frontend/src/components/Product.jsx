import { Link } from 'react-router-dom';
import { fetchProductDetails } from '../redux/productSlice';
import Rating from './Rating';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Product(children) {
  const dispatch = useDispatch();
  const { product } = children;

  const { seller } = product;
  const { seller: sellerInfo } = seller;

  useEffect(() => {
    dispatch(fetchProductDetails(product._id));
  }, [dispatch, product._id]);

  return (
    <div className="card" key={product._id}>
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2>{product.name}</h2>
        </Link>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        <div className="row">
          <div className="price">${product.price}</div>
          <div>
            {sellerInfo && (
              <Link to={`/seller/${product.seller._id}`}>
                {sellerInfo.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
