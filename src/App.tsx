import React, { useState } from 'react';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setError('Please enter a business name');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate loading and show demo data
    setTimeout(() => {
      const demoData = {
        name: searchInput.includes('Bakkerswinkel') ? "De Bakkerswinkel Centrum" : `Demo Business (${searchInput})`,
        address: "Warmoesstraat 69, 1012 HX Amsterdam, Netherlands",
        phone: "+31 20 489 8000",
        rating: 4.3,
        totalReviews: 89,
        photos: 12
      };
      
      setAuditResults(demoData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
            Google Business Profile Audit Tool
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Analyze and optimize your Google Business Profile for better local SEO
          </p>
        </div>

        {/* Demo Notice */}
        <div style={{ 
          background: '#dbeafe', 
          borderLeft: '4px solid #3b82f6', 
          padding: '15px', 
          marginBottom: '30px',
          borderRadius: '5px'
        }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', margin: '0 0 5px 0' }}>
            Demo Mode
          </p>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: '0' }}>
            Currently showing demo data. Deploy with backend API for real Google Places data.
          </p>
        </div>

        {/* Search Form */}
        <div style={{ 
          background: 'white', 
          borderRadius: '10px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          padding: '30px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter business name (e.g., 'Starbucks New York')"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px', margin: '5px 0 0 0' }}>
                Tip: Include city name for better results
              </p>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              style={{
                background: isLoading ? '#9ca3af' : '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? 'Analyzing...' : '🔍 Audit Business'}
            </button>
          </div>
          
          {error && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              background: '#fef2f2', 
              borderLeft: '4px solid #ef4444',
              borderRadius: '5px'
            }}>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: '0' }}>{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {auditResults && (
          <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 10px 0' }}>
                  {auditResults.name}
                </h2>
                <p style={{ color: '#6b7280', margin: '0 0 5px 0' }}>📍 {auditResults.address}</p>
                <p style={{ color: '#6b7280', margin: '0' }}>📞 {auditResults.phone}</p>
              </div>
              
              <div style={{ textAlign: 'center', marginLeft: '20px' }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>95%</div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Overall Score</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⭐</span>
                <span style={{ fontWeight: '600' }}>{auditResults.rating}</span>
                <span style={{ color: '#6b7280' }}>({auditResults.totalReviews} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📷</span>
                <span>{auditResults.photos} photos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🟢</span>
                <span style={{ color: '#059669' }}>Open Now</span>
              </div>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 15px 0' }}>
                Recommendations
              </h3>
              <div style={{ 
                background: '#f0fdf4', 
                borderLeft: '4px solid #22c55e', 
                padding: '15px',
                borderRadius: '5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ color: '#16a34a' }}>✅</span>
                  <p style={{ fontSize: '14px', fontWeight: '600', margin: '0' }}>Demo Data Loaded Successfully!</p>
                </div>
                <p style={{ fontSize: '14px', color: '#15803d', margin: '0' }}>
                  Your GBP Audit Tool is working. Deploy with backend API for real Google Places data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;