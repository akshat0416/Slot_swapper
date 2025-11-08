// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from './EventForm';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchEvents = async () => {
  try {
    const response = await axios.get('/api/events');
    setEvents(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error);
    setEvents([]);  // prevent events.map crash
    setError('Failed to fetch events');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData) => {
    try {
      await axios.post('/api/events', eventData);
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      setError('Failed to create event');
    }
  };

  const handleToggleSwappable = async (eventId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
      await axios.put(`/api/events/${eventId}`, { status: newStatus });
      fetchEvents();
    } catch (error) {
      setError('Failed to update event');
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await axios.delete(`/api/events/${eventToDelete._id || eventToDelete.id}`);
      setShowDeleteConfirm(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      setError('Failed to delete event');
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Calendar</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Event
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && eventToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete the event "<strong>{eventToDelete.title}</strong>"?
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <div key={event._id || event.id} className={`card slot-card ${event.status.toLowerCase()}`}>
            <div className="slot-header">
              <div style={{ flex: 1 }}>
                <div className="slot-title">{event.title}</div>
                <div className="slot-time">
                  {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                </div>
              </div>
              <span className={`status-badge status-${event.status.toLowerCase()}`}>
                {event.status.replace('_', ' ')}
              </span>
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className={`btn ${event.status === 'SWAPPABLE' ? 'btn-secondary' : 'btn-success'}`}
                onClick={() => handleToggleSwappable(event._id || event.id, event.status)}
                disabled={event.status === 'SWAP_PENDING'}
                style={{ flex: 2, minWidth: '140px' }}
              >
                {event.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
              </button>
              
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDeleteClick(event)}
                disabled={event.status === 'SWAP_PENDING'}
                style={{ flex: 1, minWidth: '80px' }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              
              {event.status === 'SWAP_PENDING' && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#d97706', width: '100%' }}>
                  This slot is part of a pending swap and cannot be modified
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No events found. Create your first event to get started!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;