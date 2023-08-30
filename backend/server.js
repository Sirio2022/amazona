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
import cloudinary from 'cloudinary';
import multer from 'multer';

const app = express();
app.use(express.json());
dotenv.config();

//Configuring Cloudinary

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

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('Server is ready');
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

app.post('/api/uploads/cdn', upload.single('image'), (req, res) => {
  try {
    const file = req.file;
    // Utiliza la función upload de Cloudinary para subir el archivo
    cloudinary.v2.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ msg: 'Error al cargar el archivo' });
        } else {
          res.json({ url: result.secure_url });
        }
      })
      .end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al cargar el archivo' });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is runnig at http://localhost:${port}`);
});
