import express from 'express';
import { productList, productDetails } from '../controllers/productController.js';

const router = express.Router();

router.get('/', productList);
router.get('/:id', productDetails);

export default router;