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
      taxPtrice: req.body.taxPtrice,
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

export { addOrderItems };
