import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const checkAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken._id).select(
        '-password -token -isConfirmed -__v -createdAt -updatedAt'
      );
      return next();
    } catch (error) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
  }

  if (!req.headers.authorization) {
    const error = new Error('No token, authorization denied');
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
