const sellerAuth = async (req, res, next) => {
    if (req.user && req.user.isSeller || req.user.isAdmin) {
        return next();
    }
    return res.status(401).json({ msg: 'Seller token or Admin token are not valid' });
};

export default sellerAuth;