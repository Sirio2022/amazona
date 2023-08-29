import { orderEmail } from '../helpers/email.js';
import Order from '../models/orderModel.js';

const addOrderItems = async (req, res) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).json({
      msg: 'Cart is empty',
    });
  } else {
    const order = new Order({
      seller: req.body.orderItems[0].seller,
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

const getOrders = async (req, res) => {
  const seller = req.query.seller || '';
  const sellerFilter = seller ? { seller } : {};
  const orders = await Order.find({
    ...sellerFilter,
  }).populate('user', 'name');
  if (orders) {
    res.json({
      msg: 'Orders found',
      orders: orders,
    });
  } else {
    res.status(404).json({
      msg: 'Orders not found',
    });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find().where({ user: req.user._id });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json({
      msg: 'Order found',
      order: order,
    });
  } else {
    res.status(404).json({
      msg: 'Order not found',
    });
  }
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    orderEmail({
      name: order.user.name,
      email: order.user.email,
      order: order,
    });
    res.status(200).json({
      msg: 'Order paid',
      order: updatedOrder,
    });
  } else {
    res.status(404).json({
      msg: 'Order not found',
    });
  }
};

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.deleteOne();
    res.json({
      msg: 'Order deleted',
      order: order,
    });
  } else {
    res.status(404).json({
      msg: 'Order not found',
    });
  }
};

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({
      msg: 'Order was delivered',
      order: updatedOrder,
    });
  } else {
    res.status(404).json({
      msg: 'Order not found',
    });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderToDelivered,
};
