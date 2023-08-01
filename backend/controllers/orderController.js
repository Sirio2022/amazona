import Order from '../models/orderModel.js';

const addOrderItems = async (req, res) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).json({
      msg: 'Cart is empty',
    });
  } else {
    const order = new Order({
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      msg: 'Order created',
      order: createdOrder,
    });
  }
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json({
      msg: 'Order found',
      order,
    });
  } else {
    res.status(404).json({
      msg: 'Order not found',
    });
  }
};

export { addOrderItems, getOrderById };
