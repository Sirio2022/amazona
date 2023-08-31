import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
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

//SOCKET

const httpServer = http.Server(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const users = [];

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);

    if (user) {
      user.online = false;
      console.log('Offline', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user);
      }
    }
  });
  socket.on('onLogin', ({ _id, name, isAdmin }) => {
    const updatedUser = {
      _id,
      name,
      isAdmin,
      online: true,
      socketId: socket.id,
      messages: [],
    };

    const existUserIndex = users.findIndex((x) => x._id === updatedUser._id);
    if (existUserIndex !== -1) {
      users[existUserIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }

    console.log('Online', name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (isAdmin) {
      io.to(socket.id).emit('listUsers', users);
    }
  });
  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  });
  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry. I am not online right now',
        });
      }
    }
  });
});

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log(`Server is runnig at http://localhost:${port}`);
// });
