import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAction } from '../redux/cartSlice';

export default function CartScreen() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const qty = searchParams.get('qty');

  //const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(addToCartAction(id, Number(qty)));
    }
  }, [dispatch, id, qty]);

  return (
    <div>
      <h1>Cart Screen</h1>
      <p>
        Add to Cart : ProductID: {id} Qty: {qty}
      </p>
    </div>
  );
}
