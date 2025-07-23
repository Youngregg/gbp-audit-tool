import React, { useState } from 'react';
import { Search, MapPin, Star, Phone, Clock, Globe, Camera, AlertCircle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';

const GBPAuditApp = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Get API key from environment or user input
  const getApiKey = () => {
    // Try to get from environment (works when deployed)
    if (typeof window !== 'undefined' && (window as any).REACT_APP_GOOGLE_PLACES_API_KEY) {
      return (window as any).REACT_APP_GOOGLE_PLACES_API_KEY;
    }
    // Use user-provided API key
    return apiKey;
  };

  // Extract place ID from Google Maps URL
  const extractPlaceId = (url: string) => {
    const patterns = [
      /place_id=([^&]+)/,
      /data=.*!3m1!4b1!4m\d+!3m\d+!1s0x[^:]+:0x([^!]+)/,
      /maps\/place\/[^\/]+\/@[^\/]+\/data=.*!4m\d+!3m\d+!1s([^!]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Check if input is a Google Maps URL
  const isGoogleMapsUrl = (input: string) => {
    return input.includes('maps.google.com') || input.includes('goo.gl/maps');
  };

  // Perform actual Google Places API search via backend
  const performAudit = async (businessQuery: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Try to use backend API first (production)
      let response;
      let businessData;
      
      try {
        response = await fetch('/.netlify/functions/places-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ businessQuery })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            businessData = result.data;
            setAuditResults(businessData);
            return;
          } else {
            throw new Error(result.error || 'Backend API error');
          }
        } else {
          throw new Error(`Backend API error: ${response.status}`);
        }
      } catch (backendError: any) {
        console.log('Backend API not available, showing demo data:', backendError.message);
        
        // Show demo data based on the search query
        const demoData = {
          placeId: 'demo_place_id',
          name: businessQuery.includes('Bakkerswinkel') ? "De Bakkerswinkel Centrum" : 
                businessQuery.includes('coffee') ? "Demo Coffee Shop" : 
                `Demo Business (${businessQuery})`,
          address: businessQuery.includes('Centrum') ? "Warmoesstraat 69, 1012 HX Amsterdam, Netherlands" : 
                   "123 Main Street, Demo City, DC 12345",
          phone: "+31 20 489 8000",
          website: "https://demobusiness.com",
          rating: 4.3,
          totalReviews: 89,
          categories: businessQuery.includes('Bakkerswinkel') ? ["Bakery", "Cafe", "Breakfast Restaurant"] :
                     businessQuery.includes('coffee') ? ["Coffee Shop", "Cafe"] : 
                     ["Restaurant", "Food"],
          hours: {
            isOpen: true,
            weekdayText: [
              "Monday: 8:00 AM – 6:00 PM",
              "Tuesday: 8:00 AM – 6:00 PM", 
              "Wednesday: 8:00 AM – 6:00 PM",
              "Thursday: 8:00 AM – 6:00 PM",
              "Friday: 8:00 AM – 7:00 PM",
              "Saturday: 8:00 AM – 7:00 PM",
              "Sunday: 9:00 AM – 5:00 PM"
            ]
          },
          photos: 12,
          businessStatus: 'OPERATIONAL',
          priceLevel: 2,
          recentReviews: [
            { rating: 5, text: "Excellent service and quality!", date: "1/20/2025", author: "Maria K." },
            { rating: 4, text: "Great atmosphere and friendly staff", date: "1/18/2025", author: "John D." },
            { rating: 5, text: "Highly recommend this place!", date: "1/15/2025", author: "Sophie L." }
          ]
        };
        
        setError('Backend API not available. Showing demo data. Deploy with backend support for real data.');
        setAuditResults(demoData);
      }
      
    } catch (err: any) {
      console.error('Audit error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!searchInput.trim()) {
      setError('Please enter a business name or Google Maps link');
      return;
    }
    performAudit(searchInput);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const calculateOverallScore = () => {
    if (!auditResults) return 0;
    
    let score = 0;
    
    // Basic info completeness (30 points)
    if (auditResults.name && auditResults.name !== 'Unknown Business') score += 5;
    if (auditResults.address && auditResults.address !== 'Address not available') score += 5;
    if (auditResults.phone) score += 5;
    if (auditResults.website) score += 5;
    if (auditResults.categories?.length > 0) score += 5;
    if (auditResults.businessStatus === 'OPERATIONAL') score += 5;
    
    // Reviews and ratings (25 points)
    if (auditResults.totalReviews > 0) score += 10;
    if (auditResults.rating >= 4.0) score += 10;
    if (auditResults.rating >= 4.5) score += 5;
    
    // Photos (15 points)
    if (auditResults.photos >= 10) score += 15;
    else if (auditResults.photos >= 5) score += 10;
    else if (auditResults.photos >= 1) score += 5;
    
    // Hours (15 points)
    if (auditResults.hours?.weekdayText?.length >= 7) score += 15;
    else if (auditResults.hours?.weekdayText?.length >= 5) score += 10;
    else if (auditResults.hours) score += 5;
    
    // Recent engagement (15 points)
    if (auditResults.recentReviews?.length >= 3) score += 10;
    else if (auditResults.recentReviews?.length >= 1) score += 5;
    if (auditResults.totalReviews >= 50) score += 5;
    
    return Math.min(score, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Google Business Profile Audit Tool</h1>
          <p className="text-gray-600 text-lg">Analyze and optimize your Google Business Profile for better local SEO</p>
        </div>

        {/* API Key Setup */}
        {!getApiKey() && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Demo Mode</p>
                <p className="text-sm text-blue-700 mt-1">
                  Currently showing demo data. Deploy with backend API for real Google Places data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter business name (e.g., 'Starbucks New York') or Google Maps link..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: Include city name for better results (e.g., "Pizza Place Chicago")
              </p>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Audit Business
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {auditResults && (
          <div className="space-y-6">
            {/* Business Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{auditResults.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{auditResults.address}</span>
                    </div>
                    {auditResults.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{auditResults.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center ml-6">
                  <div className={`text-4xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                    {calculateOverallScore()}%
                  </div>
                  <p className="text-gray-600 text-sm">Overall Score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{auditResults.rating || 'No rating'}</span>
                  {auditResults.totalReviews > 0 && (
                    <span className="text-gray-600">({auditResults.totalReviews} reviews)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gray-500" />
                  <span>{auditResults.photos} photos</span>
                </div>
                {auditResults.hours?.isOpen !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className={auditResults.hours.isOpen ? 'text-green-600' : 'text-red-600'}>
                      {auditResults.hours.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Simple Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium">Demo Data Loaded Successfully!</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your GBP Audit Tool is working. Deploy with backend API for real Google Places data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GBPAuditApp;
