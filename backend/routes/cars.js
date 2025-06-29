import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Car from '../models/Car.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect, authorize, optionalAuth, checkOwnership, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateCar = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Please provide a valid year'),
  body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('fuelType').isIn(['gasoline', 'diesel', 'electric', 'hybrid', 'lpg', 'cng']).withMessage('Invalid fuel type'),
  body('transmission').isIn(['manual', 'automatic', 'cvt', 'semi-automatic']).withMessage('Invalid transmission type'),
  body('category').isIn(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'truck', 'van', 'motorcycle']).withMessage('Invalid category'),
  body('condition').isIn(['new', 'like-new', 'excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('listingType').isIn(['sale', 'rent', 'both']).withMessage('Invalid listing type'),
  body('location.address').optional().trim(),
  body('location.city').optional().trim(),
  body('location.state').optional().trim(),
  body('location.zipCode').optional().trim(),
  body('contactInfo.phone').optional().trim()
];

// @desc    Get all cars with filtering, sorting, and pagination
// @route   GET /api/cars
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be positive'),
  query('minYear').optional().isInt({ min: 1900 }).withMessage('Min year must be valid'),
  query('maxYear').optional().isInt({ max: new Date().getFullYear() + 1 }).withMessage('Max year must be valid')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {
      status: 'active',
      isAvailable: true
    };

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Year range
    if (req.query.minYear || req.query.maxYear) {
      filter.year = {};
      if (req.query.minYear) filter.year.$gte = parseInt(req.query.minYear);
      if (req.query.maxYear) filter.year.$lte = parseInt(req.query.maxYear);
    }

    // Other filters
    if (req.query.make) filter.make = new RegExp(req.query.make, 'i');
    if (req.query.model) filter.model = new RegExp(req.query.model, 'i');
    if (req.query.category) filter.category = req.query.category;
    if (req.query.fuelType) filter.fuelType = req.query.fuelType;
    if (req.query.transmission) filter.transmission = req.query.transmission;
    if (req.query.listingType) filter.listingType = req.query.listingType;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.city) filter['location.city'] = new RegExp(req.query.city, 'i');
    if (req.query.state) filter['location.state'] = new RegExp(req.query.state, 'i');

    // Search query
    let query;
    if (req.query.search) {
      query = Car.search(req.query.search, filter);
    } else {
      query = Car.find(filter);
    }

    // Sorting
    let sortBy = {};
    switch (req.query.sortBy) {
      case 'price_asc':
        sortBy = { price: 1 };
        break;
      case 'price_desc':
        sortBy = { price: -1 };
        break;
      case 'year_desc':
        sortBy = { year: -1 };
        break;
      case 'year_asc':
        sortBy = { year: 1 };
        break;
      case 'mileage_asc':
        sortBy = { mileage: 1 };
        break;
      case 'mileage_desc':
        sortBy = { mileage: -1 };
        break;
      case 'featured':
        sortBy = { isFeatured: -1, createdAt: -1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }

    // Execute query
    const cars = await query
      .populate('owner', 'firstName lastName email role dealerInfo.businessName')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Car.countDocuments(filter);

    // Add user's favorite status if authenticated
    if (req.user) {
      cars.forEach(car => {
        car.isFavorited = req.user.favoriteCarIds.some(id => id.toString() === car._id.toString());
      });
    }

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      data: cars
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cars'
    });
  }
});

// @desc    Get user's own cars
// @route   GET /api/cars/my-cars
// @access  Private
router.get('/my-cars', protect, async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: cars
    });
  } catch (error) {
    console.error('Get user cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your cars'
    });
  }
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone role dealerInfo.businessName dealerInfo.isVerified');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Increment view count
    await car.incrementViews();

    // Add user's favorite status if authenticated
    if (req.user) {
      car.isFavorited = req.user.favoriteCarIds.some(id => id.toString() === car._id.toString());
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Get car error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching car'
    });
  }
});

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('owner', 'firstName lastName email role dealerInfo.businessName');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Only show active cars to public, but allow owners and admins to see their own cars
    if (car.status !== 'active' &&
        (!req.user || (req.user._id.toString() !== car.owner._id.toString() && req.user.role !== 'admin'))) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching car details'
    });
  }
});

// @desc    Create new car listing
// @route   POST /api/cars
// @access  Private (All authenticated users can create listings)
router.post('/', protect, validateCar, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add owner to car data
    const carData = {
      ...req.body,
      owner: req.user._id,
      ownerType: req.user.role === 'dealer' ? 'dealer' : 'private',
      status: 'pending' // All new listings require admin approval
    };

    const car = new Car(carData);
    await car.save();

    // Populate owner info
    await car.populate('owner', 'firstName lastName email role dealerInfo.businessName');

    // Send notification to all admins
    try {
      const admins = await User.find({ role: 'admin' });

      const notificationPromises = admins.map(admin =>
        Notification.create({
          type: 'car_approval_pending',
          title: 'New Car Listing Pending Approval',
          message: `${req.user.firstName} ${req.user.lastName} has submitted a new car listing: "${car.title}" for approval.`,
          recipient: admin._id,
          sender: req.user._id,
          relatedCar: car._id,
          actionRequired: true,
          metadata: {
            carTitle: car.title,
            carId: car._id.toString(),
            ownerName: `${req.user.firstName} ${req.user.lastName}`,
            ownerEmail: req.user.email
          }
        })
      );

      await Promise.all(notificationPromises);
      console.log(`Sent approval notifications to ${admins.length} admin(s) for car: ${car.title}`);
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the car creation if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Car listing created successfully and submitted for approval',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating car listing'
    });
  }
});

// @desc    Update car listing
// @route   PUT /api/cars/:id
// @access  Private (Owner only)
router.put('/:id', protect, checkOwnership(Car), validateCar, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'firstName lastName email role dealerInfo.businessName');

    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating car listing'
    });
  }
});

// @desc    Delete car listing
// @route   DELETE /api/cars/:id
// @access  Private (Owner only)
router.delete('/:id', protect, checkOwnership(Car), async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting car listing'
    });
  }
});

// @desc    Toggle favorite car
// @route   POST /api/cars/:id/favorite
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    const user = await User.findById(req.user._id);
    const carIndex = user.favoriteCarIds.indexOf(car._id);

    let message;
    if (carIndex > -1) {
      // Remove from favorites
      user.favoriteCarIds.splice(carIndex, 1);
      await car.toggleFavorite(false);
      message = 'Car removed from favorites';
    } else {
      // Add to favorites
      user.favoriteCarIds.push(car._id);
      await car.toggleFavorite(true);
      message = 'Car added to favorites';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message,
      isFavorited: carIndex === -1
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling favorite'
    });
  }
});

// @desc    Get user's favorite cars
// @route   GET /api/cars/favorites
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id).populate({
      path: 'favoriteCarIds',
      populate: {
        path: 'owner',
        select: 'firstName lastName email role dealerInfo.businessName'
      },
      options: {
        skip,
        limit,
        sort: { createdAt: -1 }
      }
    });

    const total = user.favoriteCarIds.length;

    res.status(200).json({
      success: true,
      count: user.favoriteCarIds.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      data: user.favoriteCarIds
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching favorites'
    });
  }
});

// @desc    Get user's car listings
// @route   GET /api/cars/my-listings
// @access  Private
router.get('/my-listings', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user._id };

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const cars = await Car.find(filter)
      .populate('owner', 'firstName lastName email role dealerInfo.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Car.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      data: cars
    });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user listings'
    });
  }
});

// @desc    Update car status
// @route   PATCH /api/cars/:id/status
// @access  Private (Owner only)
router.patch('/:id/status', protect, checkOwnership(Car), [
  body('status').isIn(['active', 'sold', 'rented', 'pending', 'inactive']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
        errors: errors.array()
      });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        isAvailable: req.body.status === 'active'
      },
      { new: true }
    ).populate('owner', 'firstName lastName email role dealerInfo.businessName');

    res.status(200).json({
      success: true,
      message: 'Car status updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Update car status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating car status'
    });
  }
});

// @desc    Approve car listing
// @route   PUT /api/cars/:id/approve
// @access  Private (Admin only)
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'firstName lastName email');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (car.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Car is not pending approval'
      });
    }

    // Update car status to active
    car.status = 'active';
    car.isAvailable = true;
    await car.save();

    // Send approval notification to car owner
    await Notification.create({
      type: 'car_approved',
      title: 'Car Listing Approved',
      message: `Your car listing "${car.title}" has been approved and is now live on the platform.`,
      recipient: car.owner._id,
      sender: req.user._id,
      relatedCar: car._id,
      actionRequired: false,
      metadata: {
        carTitle: car.title,
        carId: car._id.toString(),
        approvedBy: `${req.user.firstName} ${req.user.lastName}`
      }
    });

    // Mark the approval notification as completed
    await Notification.updateMany(
      {
        relatedCar: car._id,
        type: 'car_approval_pending',
        actionRequired: true
      },
      {
        actionRequired: false,
        isRead: true
      }
    );

    res.json({
      success: true,
      message: 'Car listing approved successfully',
      data: car
    });
  } catch (error) {
    console.error('Approve car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving car listing'
    });
  }
});

// @desc    Reject car listing
// @route   PUT /api/cars/:id/reject
// @access  Private (Admin only)
router.put('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;
    const car = await Car.findById(req.params.id).populate('owner', 'firstName lastName email');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (car.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Car is not pending approval'
      });
    }

    // Delete the car listing
    await Car.findByIdAndDelete(req.params.id);

    // Send rejection notification to car owner
    await Notification.create({
      type: 'car_rejected',
      title: 'Car Listing Rejected',
      message: `Your car listing "${car.title}" has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
      recipient: car.owner._id,
      sender: req.user._id,
      actionRequired: false,
      metadata: {
        carTitle: car.title,
        carId: car._id.toString(),
        rejectedBy: `${req.user.firstName} ${req.user.lastName}`,
        reason: reason || 'No reason provided'
      }
    });

    // Mark the approval notification as completed
    await Notification.updateMany(
      {
        relatedCar: car._id,
        type: 'car_approval_pending',
        actionRequired: true
      },
      {
        actionRequired: false,
        isRead: true
      }
    );

    res.json({
      success: true,
      message: 'Car listing rejected and removed',
      data: { carTitle: car.title, reason }
    });
  } catch (error) {
    console.error('Reject car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting car listing'
    });
  }
});

export default router;
