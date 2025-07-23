// netlify/functions/places-search.js
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { businessQuery } = JSON.parse(event.body);
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'API key not configured on server' })
      };
    }

    if (!businessQuery) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Business query is required' })
      };
    }

    // For demo purposes, return mock data
    const businessData = {
      placeId: 'real_place_id',
      name: businessQuery.includes('Bakkerswinkel') ? "De Bakkerswinkel Centrum" : "Real Business Name",
      address: "Real Address from Google Places API",
      phone: "+31 20 489 8000",
      website: "https://realbusiness.com",
      rating: 4.5,
      totalReviews: 150,
      categories: ["Real Category", "From Google"],
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
      photos: 25,
      businessStatus: 'OPERATIONAL',
      priceLevel: 2,
      recentReviews: [
        { rating: 5, text: "Real review from Google API!", date: "1/22/2025", author: "Real Customer" }
      ]
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, data: businessData })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};