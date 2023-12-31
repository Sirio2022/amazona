import Product from '../models/productModel.js';

const productList = async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;

  const name = req.query.name || '';
  const category = req.query.category || '';
  const seller = req.query.seller || '';
  const order = req.query.order || '';
  const min =
    req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max =
    req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating =
    req.query.rating && Number(req.query.rating) !== 0
      ? Number(req.query.rating)
      : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const sellerFilter = seller ? { seller } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder =
    order === 'lowest'
      ? { price: 1 }
      : order === 'highest'
      ? { price: -1 }
      : order === 'toprated'
      ? { rating: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...sellerFilter,
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    )
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.status(200).json({
    products,
    page,
    pages: Math.ceil(
      (await Product.countDocuments({
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      })) / pageSize
    ),
  });
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

const productCreateReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product.reviews.find((x) => x.name === req.user.name)) {
    const error = new Error('You already submitted a review');
    return res.status(400).json({ msg: error.message });
  } else {
    if (!product) {
      const error = new Error('Product not found');
      return res.status(404).json({ msg: error.message });
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((c, a) => a.rating + c, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).json({
      msg: 'Review created successfully',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  }
};

export {
  productList,
  productDetails,
  productCreate,
  productUpdate,
  productDelete,
  productCategoryList,
  productCreateReview,
};
