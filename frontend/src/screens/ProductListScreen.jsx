import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../redux/createProductSlice';
import { productReset } from '../redux/createProductSlice';

export default function ProductListScreen() {
  const [alert, setAlert] = useState('');

  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state) => state.productsList
  );

  const {
    product: productCreated,
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
  } = useSelector((state) => state.createProduct);

  const { product } = productCreated;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch(productReset());
      navigate(`/product/${product._id}/edit`);
    }
    dispatch(fetchProducts());

    if (errorCreate) {
      setAlert({ msg: errorCreate, error: true });
    }
  }, [dispatch, navigate, successCreate, productCreated, errorCreate, product]);

  const deleteHandler = () => {
    //TODO: dispatch delete action
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const { msg } = alert;

  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        <button
          type="button"
          className="primary"
          onClick={createProductHandler}
        >
          Create Product
        </button>
      </div>
      {loadingCreate && <LoadingBox />}
      {msg && <MessageBox alert={alert} />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox alert={{ msg: error, error: true }} />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => navigate(`/product/${product._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
