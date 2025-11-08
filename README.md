# Slot Swapper

A peer-to-peer time slot scheduling application that allows users to swap time slots with each other. Built with React for the frontend and Node.js with Express for the backend.

## Features

- User authentication and authorization
- Browse available time slots in the marketplace
- Request to swap time slots with other users
- Manage and respond to swap requests
- Real-time updates for slot availability

## Tech Stack

### Frontend
- React 18
- React Router v6
- Axios for API requests
- Vite as build tool

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/slot_swapper.git
   cd slot_swapper
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update .env with your API endpoint
   ```

### Running Locally

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

### Backend (`.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Project Structure

```
slot_swapper/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── contexts/     # React contexts
│       ├── pages/        # Page components
│       ├── App.jsx       # Main App component
│       └── main.jsx      # Application entry point
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ by Akshat Rana using modern web technologies

## Support

For support, please open an issue in the GitHub repository.
