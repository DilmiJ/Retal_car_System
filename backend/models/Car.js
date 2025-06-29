import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Car title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Car description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Car Details
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Car year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage cannot be negative']
  },
  
  // Engine & Performance
  engineSize: {
    type: String,
    trim: true
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg', 'cng'],
    lowercase: true
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['manual', 'automatic', 'cvt', 'semi-automatic'],
    lowercase: true
  },
  drivetrain: {
    type: String,
    enum: ['fwd', 'rwd', 'awd', '4wd'],
    lowercase: true
  },
  
  // Category & Type
  category: {
    type: String,
    required: [true, 'Car category is required'],
    enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'truck', 'van', 'motorcycle'],
    lowercase: true
  },
  bodyType: {
    type: String,
    enum: ['2-door', '4-door', '5-door', 'pickup', 'van', 'other'],
    lowercase: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  priceType: {
    type: String,
    enum: ['fixed', 'negotiable'],
    default: 'negotiable'
  },
  
  // Rental specific (if applicable)
  rentalRates: {
    hourly: Number,
    daily: Number,
    weekly: Number,
    monthly: Number
  },
  
  // Listing Type
  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['sale', 'rent', 'both'],
    default: 'sale'
  },
  
  // Condition
  condition: {
    type: String,
    required: [true, 'Car condition is required'],
    enum: ['new', 'like-new', 'excellent', 'good', 'fair', 'poor'],
    lowercase: true
  },
  
  // Images (Base64 encoded strings)
  images: [{
    type: String, // Base64 encoded image data
    required: true
  }],
  
  // Features & Equipment
  features: [{
    type: String,
    trim: true
  }],
  
  // Safety Features
  safetyFeatures: [{
    type: String,
    trim: true
  }],
  
  // Location
  location: {
    address: {
      type: String,
      required: false,
      trim: true
    },
    city: {
      type: String,
      required: false,
      trim: true
    },
    state: {
      type: String,
      required: false,
      trim: true
    },
    zipCode: {
      type: String,
      required: false,
      trim: true
    },
    country: {
      type: String,
      required: false,
      trim: true,
      default: 'USA'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  ownerType: {
    type: String,
    enum: ['private', 'dealer'],
    required: [true, 'Owner type is required']
  },
  
  // Contact Information
  contactInfo: {
    phone: {
      type: String,
      required: false,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'both'],
      default: 'both'
    }
  },
  
  // Status & Availability
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'pending', 'inactive', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  
  // Additional Information
  vin: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-HJ-NPR-Z0-9]{17}$/, 'Please enter a valid VIN number']
  },
  licensePlate: {
    type: String,
    trim: true,
    uppercase: true
  },
  
  // Dates
  availableFrom: {
    type: Date,
    default: Date.now
  },
  availableUntil: Date,
  
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for primary image
carSchema.virtual('primaryImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Virtual for age
carSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

// Indexes
carSchema.index({ make: 1, model: 1 });
carSchema.index({ category: 1 });
carSchema.index({ listingType: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ status: 1, isAvailable: 1 });
carSchema.index({ 'location.city': 1, 'location.state': 1 });
carSchema.index({ owner: 1 });
carSchema.index({ createdAt: -1 });
carSchema.index({ isFeatured: 1, createdAt: -1 });
carSchema.index({ slug: 1 });

// Text search index
carSchema.index({
  title: 'text',
  description: 'text',
  make: 'text',
  model: 'text',
  'location.city': 'text',
  'location.state': 'text'
});

// Pre-save middleware to generate slug
carSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title') || this.isModified('make') || this.isModified('model')) {
    const baseSlug = `${this.make}-${this.model}-${this.year}-${this.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

// Method to increment views
carSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { views: 1 } });
};

// Method to toggle favorite
carSchema.methods.toggleFavorite = function(increment = true) {
  return this.updateOne({ 
    $inc: { favorites: increment ? 1 : -1 } 
  });
};

// Method to increment inquiries
carSchema.methods.incrementInquiries = function() {
  return this.updateOne({ $inc: { inquiries: 1 } });
};

// Static method to find available cars
carSchema.statics.findAvailable = function(filters = {}) {
  return this.find({
    status: 'active',
    isAvailable: true,
    ...filters
  });
};

// Static method for search
carSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'active',
    isAvailable: true,
    ...filters
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

const Car = mongoose.model('Car', carSchema);

export default Car;
