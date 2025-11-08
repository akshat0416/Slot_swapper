# SlotSwapper Backend

## Setup Instructions

1. Navigate to the backend directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. The server will run on http://localhost:5000

## API Endpoints

- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/events - Get user's events
- POST /api/events - Create new event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event
- GET /api/swappable-slots - Get available slots from other users
- POST /api/swap-request - Create swap request
- POST /api/swap-response/:requestId - Respond to swap request
- GET /api/swap-requests/incoming - Get incoming swap requests
- GET /api/swap-requests/outgoing - Get outgoing swap requests