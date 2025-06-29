import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Phone, Mail, MapPin, Calendar, Gauge, Fuel, Settings, Eye, Star, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      const data = await response.json();

      if (data.success) {
        setCar(data.data);
      } else {
        toast.error('Car not found');
        navigate('/cars');
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast.error('Error loading car details');
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    setShowContactForm(true);
  };

  const handleFavorite = () => {
    toast.success('Added to favorites!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car.title,
        text: `Check out this ${car.make} ${car.model}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Car not found</h2>
          <Link to="/cars" className="text-blue-600 hover:text-blue-700">
            ← Back to cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/cars')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cars
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-96">
                {car.images && car.images.length > 0 ? (
                  <>
                    <img
                      src={car.images[currentImageIndex]}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {car.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? car.images.length - 1 : prev - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === car.images.length - 1 ? 0 : prev + 1)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                      </>
                    )}

                    {/* Image Indicators */}
                    {car.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {car.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}

                {/* Listing Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {car.listingType === 'sale' ? 'For Sale' : car.listingType === 'rent' ? 'For Rent' : 'Sale & Rent'}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    car.status === 'active' ? 'bg-green-100 text-green-800' :
                    car.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {car.status === 'active' ? 'Available' : car.status}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {car.images && car.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {car.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${car.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Car Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
                  <p className="text-xl text-gray-600">{car.make} {car.model} • {car.year}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    ${car.price?.toLocaleString()}
                    {car.listingType === 'rent' && <span className="text-lg text-gray-500">/day</span>}
                  </div>
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Year</div>
                  <div className="font-semibold">{car.year}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Gauge className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Mileage</div>
                  <div className="font-semibold">{car.mileage?.toLocaleString()} mi</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Fuel Type</div>
                  <div className="font-semibold capitalize">{car.fuelType}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Settings className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Transmission</div>
                  <div className="font-semibold capitalize">{car.transmission}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Vehicle Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize">{car.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="capitalize">{car.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engine Size:</span>
                      <span>{car.engineSize || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="capitalize">{car.color || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{car.location?.address}</div>
                      <div>{car.location?.city}, {car.location?.state} {car.location?.zipCode}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Seller</h3>
              
              {/* Seller Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {car.owner?.firstName?.[0]}{car.owner?.lastName?.[0]}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {car.owner?.firstName} {car.owner?.lastName}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {car.ownerType} Seller
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Seller
                </button>
                
                <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>

              {/* Contact Info */}
              {car.contactInfo?.phone && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{car.contactInfo.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Meet in a public place</li>
                    <li>• Inspect the vehicle thoroughly</li>
                    <li>• Verify ownership documents</li>
                    <li>• Never send money in advance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Seller</h3>
            <div className="text-center">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Call the seller directly:</p>
              <a
                href={`tel:${car.contactInfo?.phone}`}
                className="text-2xl font-bold text-blue-600 hover:text-blue-700"
              >
                {car.contactInfo?.phone}
              </a>
            </div>
            <button
              onClick={() => setShowContactForm(false)}
              className="w-full mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetail;
