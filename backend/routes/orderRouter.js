import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';

const router = express.Router();

import { addOrderItems } from '../controllers/orderController.js';

router.post('/', addOrderItems);
