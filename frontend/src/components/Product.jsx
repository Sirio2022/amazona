import Rating from './Rating';

export default function Product(children) {
  const { product } = children;

  return (
    <div className="card" key={product.id}>
      <a href="product.html">
        <img className="medium" src={product.image} alt={product.name} />
      </a>
      <div className="card-body">
        <a href={`/product/${product.id}`}>
          <h2>{product.name}</h2>
        </a>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        <div className="price">${product.price}</div>
      </div>
    </div>
  );
}
