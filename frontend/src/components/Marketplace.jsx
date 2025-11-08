// src/components/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import api from '../config/api';     // ✅ use configured axios instance
import SwapModal from './SwapModal';

function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [slotsResponse, mySlotsResponse] = await Promise.all([
        api.get('/api/swappable-slots'),  // ✅ uses baseURL + token
        api.get('/api/events')
      ]);

      // ✅ ensure always arrays
      setSlots(Array.isArray(slotsResponse.data) ? slotsResponse.data : []);
      setMySwappableSlots(
        Array.isArray(mySlotsResponse.data)
          ? mySlotsResponse.data.filter(slot => slot.status === 'SWAPPABLE')
          : []
      );
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSwap = (slot) => {
    if (mySwappableSlots.length === 0) {
      setError('You need at least one swappable slot to request a swap');
      return;
    }
    setSelectedSlot(slot);
    setShowSwapModal(true);
  };

  const handleSwapComplete = () => {
    setShowSwapModal(false);
    setSelectedSlot(null);
    fetchData();
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Available Slots Marketplace</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {slots.map(slot => (
          <div key={slot._id} className="card slot-card swappable">
            <div className="slot-header">
              <div style={{ flex: 1 }}>
                <div className="slot-title">{slot.title}</div>
                <div className="slot-time">
                  {formatDateTime(slot.start_time)} - {formatDateTime(slot.end_time)}
                </div>
              </div>
            </div>
            <div className="slot-owner">Offered by: {slot.owner_name}</div>

            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={() => handleRequestSwap(slot)}
              disabled={mySwappableSlots.length === 0}
            >
              Request Swap
            </button>
          </div>
        ))}
      </div>

      {slots.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No swappable slots available.</p>
        </div>
      )}

      {showSwapModal && selectedSlot && (
        <SwapModal
          targetSlot={selectedSlot}
          mySlots={mySwappableSlots}
          onComplete={handleSwapComplete}
          onCancel={() => {
            setShowSwapModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}

export default Marketplace;