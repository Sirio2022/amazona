import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  productList,
  productDetails,
  productCreate,
  productUpdate,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', productList);
router.get('/:id', productDetails);
router.post('/', checkAuth, adminAuth, productCreate);
router.put('/:id', checkAuth, adminAuth, productUpdate);

export default router;
