const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const fileBuffer = req.file.buffer;
    
    // We wrap Cloudinary upload stream in a Promise
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'zenith_arcade' },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
        res.json({
          message: 'Image Uploaded',
          imageUrl: result.secure_url,
        });
      }
    );

    // End stream
    uploadStream.end(fileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
