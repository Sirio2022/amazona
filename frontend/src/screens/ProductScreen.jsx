import { useParams } from 'react-router-dom';
import data from '../data';

export default function ProductScreen() {
  const params = useParams();
  const product = data.products.find((x) => x._id === Number(params.id));
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="col-1"></div>

        <div className="col-1"></div>
      </div>
    </div>
  );
}
