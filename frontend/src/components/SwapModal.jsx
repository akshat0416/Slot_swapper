import React, { useState } from 'react';
import api from "../config/api";

function SwapModal({ targetSlot, mySlots, onComplete, onCancel }) {
  const [selectedMySlot, setSelectedMySlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMySlot) {
      setError('Please select one of your slots to offer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/api/swap-request', {
        mySlotId: selectedMySlot,
        theirSlotId: targetSlot._id || targetSlot.id
      });
      
      onComplete();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create swap request');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '1rem' }}>Request Swap</h3>
        
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="slot-title" style={{ marginBottom: '0.5rem' }}>Target Slot</div>
          <div><strong>Title:</strong> {targetSlot.title}</div>
          <div><strong>Time:</strong> {formatDateTime(targetSlot.start_time)} - {formatDateTime(targetSlot.end_time)}</div>
          <div><strong>Owner:</strong> {targetSlot.owner_name}</div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select your slot to offer:</label>
            <select
              className="form-input"
              value={selectedMySlot}
              onChange={(e) => setSelectedMySlot(e.target.value)}
              required
            >
              <option value="">Choose a slot</option>
              {mySlots.map(slot => (
                <option key={slot._id || slot.id} value={slot._id || slot.id}>
                  {slot.title} ({formatDateTime(slot.start_time)} - {formatDateTime(slot.end_time)})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Requesting...' : 'Request Swap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SwapModal;