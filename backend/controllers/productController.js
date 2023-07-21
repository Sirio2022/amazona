import data from '../data.js';

const productList = async (req, res) => {
  res.json(data.products);
};

const productDetails = async (req, res) => {
  const product = data.products.find((x) => x._id === Number(req.params.id));
  if (product) {
    res.send(product);
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
};

export { productList, productDetails };
