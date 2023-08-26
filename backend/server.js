import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/userRouter.js';
import productRoutes from './routes/productRouter.js';
import orderRoutes from './routes/orderRouter.js';
import checkAuth from './middleware/checkAuth.js';
import uploadRouter from './routes/uploadRouter.js';
import path from 'path';

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
app.use('/api/uploads', checkAuth, uploadRouter);

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);

app.use('/api/orders', checkAuth, orderRoutes);

app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('Server is ready');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is runnig at http://localhost:${port}`);
});
