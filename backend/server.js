import express from 'express';
import cors from 'cors';
import data from './data.js';

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

app.get('/api/products/:id', (req, res) => {
  const product = data.products.find((x) => x._id === Number(req.params.id));
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is runnig at http://localhost:${port}`);
});
