import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function CartScreen() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const qty = searchParams.get('qty');

  return (
    <div>
      <h1>Cart Screen</h1>
      <p>
        Add to Cart : ProductID: {id} Qty: {qty}
      </p>
    </div>
  );
}
