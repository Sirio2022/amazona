import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/userRouter.js';
import productRoutes from './routes/productRouter.js';
import orderRoutes from './routes/orderRouter.js';
import checkAuth from './middleware/checkAuth.js';

const app = express();
app.use(express.json());
dotenv.config();

// Connecting to MongoDB
connectDB();

//Configuring CORS
const whitelist = ['http://localhost:5173'];

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

//Configuring routes

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);

app.use('/api/orders', checkAuth, orderRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is runnig at http://localhost:${port}`);
});
