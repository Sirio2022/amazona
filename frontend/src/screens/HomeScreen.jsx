import Product from '../components/Product';
import data from '../data';

export default function HomeScreen() {
  return (
    <div className="row center">
      {data.products.map((product) => (
        <Product product={product} key={product._id} />
      ))}
    </div>
  );
}
