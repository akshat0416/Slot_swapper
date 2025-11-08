// src/components/LandingPage.jsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <Link to="/" className="nav-brand">
              <div className="logo">
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <span className="brand-name">SlotSwapper</span>
            </Link>
            <div className="nav-actions">
              <Link to="/login" className="btn btn-outline">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              The intelligent way to swap time slots with your peers
            </h1>
            <p className="hero-subtitle">
              Flexible scheduling made simple. Coordinate and exchange time slots effortlessly with colleagues and teammates.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose SlotSwapper?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Calendar</h3>
              <p>
                Manage your schedule with an intuitive calendar interface. Mark slots as swappable with one click.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Peer Marketplace</h3>
              <p>
                Browse available time slots from other users and find the perfect swap for your schedule.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Swaps</h3>
              <p>
                Send and receive swap requests instantly. Accept or decline with real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Create Your Schedule</h3>
              <p>Add your events and meetings to your personal calendar.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🎯</div>
              <h3>Mark Slots as Swappable</h3>
              <p>Identify time slots you're willing to swap and make them available to others.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">🔍</div>
              <h3>Browse & Request</h3>
              <p>Find slots from other users and send swap requests with your available times.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">✅</div>
              <h3>Accept & Swap</h3>
              <p>Review incoming requests and accept the ones that work for you. Calendars update automatically!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to start swapping?</h2>
            <p className="cta-subtitle">
              Join SlotSwapper today and take control of your schedule.
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <Link to="/" className="nav-brand">
              <div className="logo">
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <span className="brand-name">SlotSwapper</span>
            </Link>
            <p className="footer-tagline">
              Intelligent time slot swapping for modern teams
            </p>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SlotSwapper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;