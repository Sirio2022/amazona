import Product from '../models/productModel.js';

const productList = async (req, res) => {
  const min =
    req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max =
    req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;

  const priceFilter =
    min && max
      ? {
          price: {
            $gte: min,
            $lte: max,
          },
        }
      : {};

  const name = req.query.name || '';
  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const seller = req.query.seller || '';
  const sellerFilter = seller ? { seller } : {};
  const category = req.query.category || '';
  const categoryFilter = category ? { category } : {};
  const products = await Product.find({
    ...sellerFilter,
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
  }).populate(
    'seller',
    'seller.name seller.logo seller.rating seller.numReviews'
  );
  res.status(200).json(products);
};

const productDetails = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'seller.name seller.logo seller.rating seller.numReviews'
  );
  if (product) {
    res.status(200).json(product);
  } else {
    const error = new Error('Product not found');
    res.status(404).json({ msg: error.message });
  }
};

const productCreate = async (req, res) => {
  const product = new Product({
    name: 'Sample name' + Date.now(),
    seller: req.user._id,
    image: '/images/p4.jpg',
    price: 0,
    category: 'Sample category',
    brand: 'Sample brand',
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json({
    msg: 'Product created successfully',
    product: createdProduct,
  });
};

const productUpdate = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    res.status(200).json({
      msg: 'Product updated successfully',
      productUpdate: updatedProduct,
    });
  } else {
    const error = new Error('Product not found');
    res.status(404).json({ msg: error.message });
  }
};

const productDelete = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const deletedProduct = await product.deleteOne();
    res.status(200).json({
      msg: 'Product deleted successfully',
      deletedProduct: deletedProduct,
    });
  } else {
    const error = new Error('Product not found');
    res.status(404).json({ msg: error.message });
  }
};

const productCategoryList = async (req, res) => {
  const categories = await Product.find().distinct('category');
  res.status(200).json(categories);
};

export {
  productList,
  productDetails,
  productCreate,
  productUpdate,
  productDelete,
  productCategoryList,
};
