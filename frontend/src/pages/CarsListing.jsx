import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, MapPin, Calendar, Gauge, Fuel, Heart, Eye, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const CarsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    listingType: searchParams.get('listingType') || '',
    make: searchParams.get('make') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchCars();
  }, [searchParams]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add all filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      queryParams.append('page', pagination.page);
      queryParams.append('limit', pagination.limit);

      const response = await fetch(`/api/cars?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCars(data.data);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch cars');
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Error loading cars');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      listingType: '',
      make: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      fuelType: '',
      transmission: '',
      condition: '',
      city: '',
      state: ''
    });
    setSearchParams({});
  };

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Car Image */}
      <div className="h-48 bg-gray-200 relative">
        {car.images && car.images.length > 0 ? (
          <img 
            src={car.images[0]} 
            alt={car.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Listing Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {car.listingType === 'sale' ? 'For Sale' : car.listingType === 'rent' ? 'For Rent' : 'Sale/Rent'}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Car Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{car.make} {car.model} • {car.year}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${car.price?.toLocaleString()}
            {car.listingType === 'rent' && <span className="text-sm text-gray-500">/day</span>}
          </span>
        </div>

        {/* Car Info */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Gauge className="w-3 h-3 mr-1" />
            {car.mileage?.toLocaleString()} mi
          </div>
          <div className="flex items-center">
            <Fuel className="w-3 h-3 mr-1" />
            {car.fuelType}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {car.year}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {car.location?.city}, {car.location?.state}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/cars/${car._id}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Link>
          <button className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <Phone className="w-4 h-4 mr-1" />
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Cars</h1>
              <p className="text-gray-600">Find your perfect car from our collection</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Make, model, or keyword..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Listing Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange('listingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="both">Sale & Rent</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* More filters can be added here */}
            </div>
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {cars.length} of {pagination.total} cars
                  </p>
                </div>

                {/* Cars Grid */}
                {cars.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {cars.map((car) => (
                      <CarCard key={car._id} car={car} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsListing;
