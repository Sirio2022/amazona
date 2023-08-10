import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productsSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../redux/createProductSlice';
import { productCreateReset } from '../redux/createProductSlice';
import { deleteProduct } from '../redux/deleteProductSlice';
import { deleteProductReset } from '../redux/deleteProductSlice';
import Swal from 'sweetalert2';

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

  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = useSelector((state) => state.productDelete);

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch(productCreateReset());

      navigate(`/product/${product._id}/edit`);
    }
    dispatch(fetchProducts());

    if (successDelete) {
      dispatch(deleteProductReset());
    }
  }, [dispatch, successCreate, successDelete, navigate, product]);

  const deleteHandler = (product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover ${product.name}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it!',
      confirmButtonColor: '#f50057',
      cancelButtonColor: '#3f51b5',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', `${product.name} has been deleted.`, 'success');
        dispatch(deleteProduct(product._id));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', `${product.name} is safe :)`, 'error');
      }
    });

    if (errorDelete) {
      setAlert({ msg: errorDelete, error: true });
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

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

      {loadingDelete && <LoadingBox />}
      {errorDelete && <MessageBox alert={alert} />}

      {loadingCreate && <LoadingBox />}
      {errorCreate && <MessageBox alert={alert} />}
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
