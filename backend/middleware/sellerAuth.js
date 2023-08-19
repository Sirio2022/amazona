const sellerAuth = async (req, res, next) => {
  if (req.user && req.user.isSeller) {
    return next();
  }
  return res.status(401).json({ msg: 'Seller token is not valid' });
};

export default sellerAuth;
