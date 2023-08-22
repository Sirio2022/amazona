import { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import { fetchProducts } from '../redux/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { listTopSollers } from '../redux/topSellersSlice';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const [alert, setAlert] = useState({});

  const { error, products, loading } = useSelector(
    (state) => state.productsList
  );

  const {
    topSellers,
    loading: loadingTopSellers,
    error: errorLoadingTopSellers,
  } = useSelector((state) => state.topSellers);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(listTopSollers());

    if (error) {
      setAlert({ msg: error, error: true });
    }

    if (errorLoadingTopSellers) {
      setAlert({ msg: errorLoadingTopSellers, error: true });
    }
  }, [dispatch, error, errorLoadingTopSellers]);

  const { msg } = alert;

  return (
    <div>
      <h2>Top Sellers</h2>
      {msg && <MessageBox alert={alert} />}
      {loadingTopSellers && <LoadingBox />}
      {topSellers && (
        <Carousel showArrows autoPlay infiniteLoop showThumbs={false}>
          {topSellers.map((seller) => (
            <div key={seller._id}>
              <Link to={`/seller/${seller._id}`}>
                <img src={seller.seller.logo} alt={seller.seller.name} />
                <p className="legend">{seller.seller.name}</p>
              </Link>
            </div>
          ))}
        </Carousel>
      )}

      <h2>Featured Products</h2>
      {msg && <MessageBox alert={alert} />}
      {loading && <LoadingBox />}
      {products && (
        <div className="row center">
          {products.map((product) => (
            <Product product={product} key={product._id} />
          ))}
        </div>
      )}
    </div>
  );
}
