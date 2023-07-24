import Product from '../models/productModel.js';

const productList = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
};

const productDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    const error = new Error('Product not found');
    res.status(404).json({ msg: error.message });
  }
};

export { productList, productDetails };
