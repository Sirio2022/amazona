const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).json({ msg: 'Admin token is not valid' });
};

export default adminAuth;
