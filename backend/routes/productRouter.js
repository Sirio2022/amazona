import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import sellerAuth from '../middleware/sellerAuth.js';
import AdminAuthOrSellerAuth from '../middleware/adminAuthOrSellerAuth.js';

import {
  productList,
  productDetails,
  productCreate,
  productUpdate,
  productDelete,
  productCategoryList,
  productCreateReview,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', productList);
router.get('/categories', productCategoryList);
router.get('/:id', productDetails);
router.post('/', checkAuth, AdminAuthOrSellerAuth, productCreate);
router.put('/:id', checkAuth, AdminAuthOrSellerAuth, productUpdate);
router.delete('/:id', checkAuth, AdminAuthOrSellerAuth, productDelete);
router.put('/:id/reviews', checkAuth, productCreateReview);

export default router;
