import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../redux/productSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { updateProduct } from '../redux/updateProductSlice';
import { productUpdateReset } from '../redux/updateProductSlice';
import axios from 'axios';

export default function ProductEditScreen() {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState('');

  const [loadingUpload, setLoadingUpload] = useState(false);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { msg: msgUpdate } = product;

  const { userInfo } = useSelector((state) => state.signin);

  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = useSelector((state) => state.updateProduct);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!product || product._id !== id || successUpdate) {
      dispatch(productUpdateReset());
      dispatch(fetchProductDetails(id));

      if (error) {
        setAlert({ msg: error, error: true });
      }
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    }
  }, [dispatch, error, id, navigate, product, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: id,
        name,
        price,
        image,
        category,
        countInStock,
        brand,
        description,
      })
    );
    navigate('/productlist');

    if (msgUpdate) {
      setAlert({ msg: product.msg, error: false });
      setTimeout(() => {
        setAlert('');
      }, 3000);
    }

    if (errorUpdate) {
      setAlert({ msg: errorUpdate, error: true });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/uploads',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setAlert({ msg: error.message, error: true });
      setLoadingUpload(false);
    }
  };

  const { msg } = alert;

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit Product {id}</h1>
        </div>
        {loadingUpdate && <LoadingBox />}
        {errorUpdate && <MessageBox alert={alert} />}
        {loading ? (
          <LoadingBox />
        ) : msgUpdate ? (
          <MessageBox alert={alert} />
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image">Image</label>
              <input
                type="text"
                id="image"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="imageFile">Image File</label>
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                onChange={uploadFileHandler}
              />
              {loadingUpload && <LoadingBox />}
              {msg && <MessageBox alert={alert} />}
            </div>
            <div>
              <label htmlFor="countinstock">Count In Stock</label>
              <input
                type="text"
                id="countinstock"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="primary">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
