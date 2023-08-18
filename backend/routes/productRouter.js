import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import sellerAuth from '../middleware/sellerAuth.js';
import {
  productList,
  productDetails,
  productCreate,
  productUpdate,
  productDelete,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', productList);
router.get('/:id', productDetails);
router.post('/', checkAuth, adminAuth, sellerAuth, productCreate);
router.put('/:id', checkAuth, adminAuth, sellerAuth, productUpdate);
router.delete('/:id', checkAuth, adminAuth, productDelete);

export default router;
