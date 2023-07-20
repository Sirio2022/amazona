import { useEffect } from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import { fetchProducts } from '../redux/productsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function HomeScreen() {
  const { error, products, loading } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="row center">
          {products.map((product) => (
            <Product product={product} key={product._id} />
          ))}
        </div>
      )}
    </div>
  );
}
