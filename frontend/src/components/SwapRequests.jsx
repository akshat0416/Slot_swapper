import React, { useState, useEffect } from 'react';
import api from "../config/api";

function SwapRequests() {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const [incomingResponse, outgoingResponse] = await Promise.all([
        api.get('/api/swap-requests/incoming'),
        api.get('/api/swap-requests/outgoing')
      ]);
      
      setIncomingRequests(incomingResponse.data);
      setOutgoingRequests(outgoingResponse.data);
    } catch (error) {
      setError('Failed to fetch swap requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, accepted) => {
    try {
      await api.post(`/api/swap-response/${requestId}`, { accepted });
      fetchRequests();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to process response');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { class: 'status-pending', text: 'Pending' },
      ACCEPTED: { class: 'status-swappable', text: 'Accepted' },
      REJECTED: { class: 'status-busy', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Swap Requests</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Requests ({incomingRequests.length})
        </button>
        <button 
          className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Outgoing Requests ({outgoingRequests.length})
        </button>
      </div>

      {activeTab === 'incoming' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Incoming Swap Requests</h2>
          
          {incomingRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>No incoming swap requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1">
              {incomingRequests.map(request => (
                <div key={request._id || request.id} className="card">
                  <div className="slot-header">
                    <div style={{ flex: 1 }}>
                      <div className="slot-title">Swap Request from {request.requester_name}</div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div><strong>They offer:</strong> {request.requester_slot_title}</div>
                        <div><strong>Time:</strong> {formatDateTime(request.requester_slot_start)} - {formatDateTime(request.requester_slot_end)}</div>
                        <div><strong>For your slot:</strong> You'll receive their slot in exchange</div>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button 
                        className="btn btn-success"
                        onClick={() => handleResponse(request._id || request.id, true)}
                      >
                        Accept
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleResponse(request._id || request.id, false)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'outgoing' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Outgoing Swap Requests</h2>
          
          {outgoingRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>No outgoing swap requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1">
              {outgoingRequests.map(request => (
                <div key={request._id || request.id} className="card">
                  <div className="slot-header">
                    <div style={{ flex: 1 }}>
                      <div className="slot-title">Swap Request to {request.target_user_name}</div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div><strong>You offered your:</strong> Your slot</div>
                        <div><strong>For their slot:</strong> {request.target_slot_title}</div>
                        <div><strong>Time:</strong> {formatDateTime(request.target_slot_start)} - {formatDateTime(request.target_slot_end)}</div>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div style={{ marginTop: '0.5rem', color: '#d97706' }}>
                      Waiting for response from {request.target_user_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SwapRequests;