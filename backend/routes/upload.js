import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single image (base64)
// @route   POST /api/upload/image
// @access  Private
router.post('/image', protect, [
  body('image').notEmpty().withMessage('Image data is required'),
  body('filename').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Filename must be between 1 and 255 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { image, filename } = req.body;

    // Validate base64 image format
    const base64Regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    
    if (!base64Regex.test(image)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Only JPEG, PNG, and WebP are allowed.'
      });
    }

    // Extract content type
    const contentTypeMatch = image.match(/^data:(image\/[a-z]+);base64,/);
    const contentType = contentTypeMatch ? contentTypeMatch[1] : 'image/jpeg';

    // Check file size (5MB limit)
    const base64Data = image.split(',')[1];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default
    
    if (sizeInBytes > maxSize) {
      return res.status(400).json({
        success: false,
        message: `Image size too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`
      });
    }

    // Generate filename if not provided
    const finalFilename = filename || `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Return the processed image data
    const imageData = {
      data: image,
      contentType,
      filename: finalFilename,
      size: sizeInBytes,
      uploadedAt: new Date(),
      uploadedBy: req.user._id
    };

    res.status(200).json({
      success: true,
      message: 'Image processed successfully',
      data: imageData
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing image'
    });
  }
});

// @desc    Upload multiple images (base64)
// @route   POST /api/upload/images
// @access  Private
router.post('/images', protect, [
  body('images').isArray({ min: 1, max: 10 }).withMessage('Images must be an array with 1-10 items'),
  body('images.*.image').notEmpty().withMessage('Each image data is required'),
  body('images.*.filename').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Filename must be between 1 and 255 characters'),
  body('images.*.isPrimary').optional().isBoolean().withMessage('isPrimary must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { images } = req.body;
    const processedImages = [];
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default
    let totalSize = 0;

    // Validate and process each image
    for (let i = 0; i < images.length; i++) {
      const { image, filename, isPrimary } = images[i];

      // Validate base64 image format
      const base64Regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
      
      if (!base64Regex.test(image)) {
        return res.status(400).json({
          success: false,
          message: `Invalid image format for image ${i + 1}. Only JPEG, PNG, and WebP are allowed.`
        });
      }

      // Extract content type
      const contentTypeMatch = image.match(/^data:(image\/[a-z]+);base64,/);
      const contentType = contentTypeMatch ? contentTypeMatch[1] : 'image/jpeg';

      // Check individual file size
      const base64Data = image.split(',')[1];
      const sizeInBytes = (base64Data.length * 3) / 4;
      totalSize += sizeInBytes;
      
      if (sizeInBytes > maxSize) {
        return res.status(400).json({
          success: false,
          message: `Image ${i + 1} size too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`
        });
      }

      // Generate filename if not provided
      const finalFilename = filename || `image_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;

      processedImages.push({
        data: image,
        contentType,
        filename: finalFilename,
        size: sizeInBytes,
        isPrimary: isPrimary || false,
        uploadedAt: new Date(),
        uploadedBy: req.user._id
      });
    }

    // Check total size (50MB limit for multiple images)
    const maxTotalSize = 50 * 1024 * 1024; // 50MB
    if (totalSize > maxTotalSize) {
      return res.status(400).json({
        success: false,
        message: `Total images size too large. Maximum total size is ${Math.round(maxTotalSize / 1024 / 1024)}MB.`
      });
    }

    // Ensure only one primary image
    const primaryImages = processedImages.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      processedImages.forEach((img, index) => {
        if (img.isPrimary && index > 0) {
          img.isPrimary = false;
        }
      });
    } else if (primaryImages.length === 0 && processedImages.length > 0) {
      // Set first image as primary if none specified
      processedImages[0].isPrimary = true;
    }

    res.status(200).json({
      success: true,
      message: `${processedImages.length} images processed successfully`,
      data: processedImages,
      totalSize,
      count: processedImages.length
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing images'
    });
  }
});

// @desc    Validate image format and size
// @route   POST /api/upload/validate
// @access  Private
router.post('/validate', protect, [
  body('image').notEmpty().withMessage('Image data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { image } = req.body;

    // Validate base64 image format
    const base64Regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    
    if (!base64Regex.test(image)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Only JPEG, PNG, and WebP are allowed.',
        isValid: false
      });
    }

    // Extract content type
    const contentTypeMatch = image.match(/^data:(image\/[a-z]+);base64,/);
    const contentType = contentTypeMatch ? contentTypeMatch[1] : 'image/jpeg';

    // Check file size
    const base64Data = image.split(',')[1];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default
    
    const isValidSize = sizeInBytes <= maxSize;

    res.status(200).json({
      success: true,
      isValid: isValidSize,
      data: {
        contentType,
        size: sizeInBytes,
        maxSize,
        sizeInMB: Math.round((sizeInBytes / 1024 / 1024) * 100) / 100,
        maxSizeInMB: Math.round((maxSize / 1024 / 1024) * 100) / 100
      },
      message: isValidSize ? 'Image is valid' : 'Image size exceeds maximum allowed size'
    });
  } catch (error) {
    console.error('Validate image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating image'
    });
  }
});

// @desc    Get upload limits and allowed formats
// @route   GET /api/upload/limits
// @access  Public
router.get('/limits', (req, res) => {
  try {
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(',');

    res.status(200).json({
      success: true,
      data: {
        maxFileSize,
        maxFileSizeInMB: Math.round((maxFileSize / 1024 / 1024) * 100) / 100,
        maxTotalSize: 50 * 1024 * 1024, // 50MB for multiple images
        maxTotalSizeInMB: 50,
        maxImagesPerUpload: 10,
        allowedTypes,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp']
      }
    });
  } catch (error) {
    console.error('Get upload limits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upload limits'
    });
  }
});

export default router;
