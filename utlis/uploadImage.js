
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure dotenv to load environment variables
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  
  // Create Cloudinary storage engine for Multer
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      if (file.mimetype === 'application/pdf') {
        return {
          folder: 'uploads',
          allowed_formats: ['pdf'],
        };
      } else {
        return {
          folder: 'uploads',
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
        };
      }
    },
  });
  

// Create Multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;