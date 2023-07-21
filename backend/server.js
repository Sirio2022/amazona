import express from 'express';
import cors from 'cors';

import {
  productList,
  productDetails,
} from './controllers/productController.js';

const app = express();

// Configuring CORS
const whitelist = ['http://localhost:5173', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.get('/api/products/:id', productDetails);

app.get('/api/products', productList);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is runnig at http://localhost:${port}`);
});
