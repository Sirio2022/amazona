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
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', productList);
router.get('/categories', productCategoryList )
router.get('/:id', productDetails);
router.post('/', checkAuth, AdminAuthOrSellerAuth, productCreate);
router.put('/:id', checkAuth, AdminAuthOrSellerAuth, productUpdate);
router.delete('/:id', checkAuth, AdminAuthOrSellerAuth, productDelete);

export default router;
