const AdminAuthOrSellerAuth = (req, res, next) => {
    if (req.user && (req.user.isAdmin || req.user.isSeller)) {
        return next();
    }
    return res.status(401).json({ msg: 'Admin or Seller token is not valid' });
};

export default AdminAuthOrSellerAuth;