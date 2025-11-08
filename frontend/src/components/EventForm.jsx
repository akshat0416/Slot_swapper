// src/components/EventForm.jsx
import React, { useState, useEffect } from 'react';

function EventForm({ onSubmit, onCancel, eventToEdit, onDelete }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('BUSY');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStartTime(new Date(eventToEdit.start_time).toISOString().slice(0, 16));
      setEndTime(new Date(eventToEdit.end_time).toISOString().slice(0, 16));
      setStatus(eventToEdit.status);
    }
  }, [eventToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert('End time must be after start time');
      return;
    }

    onSubmit({
      title,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      status
    });

    // Reset form if not editing
    if (!eventToEdit) {
      setTitle('');
      setStartTime('');
      setEndTime('');
      setStatus('BUSY');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToEdit && onDelete) {
      onDelete(eventToEdit._id || eventToEdit.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3 style={{ marginBottom: '1rem' }}>
            {eventToEdit ? 'Edit Event' : 'Create New Event'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="BUSY">Busy</option>
                <option value="SWAPPABLE">Swappable</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem', flexWrap: 'wrap' }}>
              {eventToEdit && (
                <button 
                  type="button" 
                  className="btn btn-danger btn-small"
                  onClick={handleDeleteClick}
                  style={{ marginRight: 'auto' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {eventToEdit ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem', color: '#dc2626' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete this event?
              <br />
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                This action cannot be undone.
              </span>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
              >
                <i className="fa-solid fa-trash"></i> Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventForm;