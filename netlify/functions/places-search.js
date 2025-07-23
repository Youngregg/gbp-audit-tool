exports.handler = async (event, context) => {
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { businessQuery } = JSON.parse(event.body);
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Search for business
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessQuery)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.candidates || searchData.candidates.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Business not found' })
      };
    }

    const placeId = searchData.candidates[0].place_id;

    // Get business details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,opening_hours,photos,business_status,reviews&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    const place = detailsData.result;

    const businessData = {
      placeId: placeId,
      name: place.name || 'Unknown Business',
      address: place.formatted_address || 'Address not available',
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      rating: place.rating || 0,
      totalReviews: place.user_ratings_total || 0,
      categories: place.types || [],
      hours: place.opening_hours ? {
        isOpen: place.opening_hours.open_now,
        weekdayText: place.opening_hours.weekday_text
      } : null,
      photos: place.photos ? place.photos.length : 0,
      businessStatus: place.business_status || 'UNKNOWN',
      recentReviews: place.reviews ? place.reviews.slice(0, 3).map(review => ({
        rating: review.rating,
        text: review.text,
        date: new Date(review.time * 1000).toLocaleDateString(),
        author: review.author_name
      })) : []
    };

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, data: businessData })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
