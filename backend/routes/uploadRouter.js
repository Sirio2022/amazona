import multer from 'multer';
import express from 'express';
import path from 'path';

const uploadRouter = express.Router();

const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', '/frontend/public/uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.slice(
      file.originalname.lastIndexOf('.')
    );
    cb(null, Date.now() + extension);
  },
});

const upload = multer({ storage: storage }).single('image');

uploadRouter.post('/', upload, (req, res) => {
  const filePath = req.file.path.replace(/\\/g, '/');
  const fileName = path.basename(filePath);
  res.send(`/uploads/${fileName}`);
});

export default uploadRouter;