const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akki200416_db_user:ydgcGmEJLdoCr4Jr@cluster0.7algyhm.mongodb.net/?appName=Cluster0';
// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app', // Replace with your Vercel domain
    'https://slot-swapper.vercel.app' // Example domain
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Models
const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamps: true
});

const EventSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
    default: 'BUSY'
  },
  user_id: {
    type: String,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const SwapRequestSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  requester_slot_id: {
    type: String,
    ref: 'Event',
    required: true
  },
  target_slot_id: {
    type: String,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  responded_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);
const SwapRequest = mongoose.model('SwapRequest', SwapRequestSchema);

// Enhanced MongoDB connection with better error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});

// Middleware to verify JWT token (keep your existing middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working with MongoDB!',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.json({
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
      database: dbStates[dbState],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Root route 
app.get('/', (req, res) => {
  res.json({ 
    message: 'SlotSwapper Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/health'
  });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Events Routes
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ user_id: req.user.id }).sort({ start_time: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, startTime, endTime, status = 'BUSY' } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, startTime, and endTime are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const event = new Event({
      title,
      start_time: start,
      end_time: end,
      status,
      user_id: req.user.id
    });

    await event.save();
    res.status(201).json(event);

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, status } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (startTime !== undefined) updates.start_time = new Date(startTime);
    if (endTime !== undefined) updates.end_time = new Date(endTime);
    if (status !== undefined) updates.status = status;

    if (updates.start_time && updates.end_time && updates.start_time >= updates.end_time) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event || event.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Swap Routes
app.get('/api/swappable-slots', authenticateToken, async (req, res) => {
  try {
    const slots = await Event.aggregate([
      {
        $match: {
          status: 'SWAPPABLE',
          user_id: { $ne: req.user.id }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: '$owner'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          start_time: 1,
          end_time: 1,
          status: 1,
          user_id: 1,
          createdAt: 1,
          updatedAt: 1,
          owner_name: '$owner.name'
        }
      },
      {
        $sort: { start_time: 1 }
      }
    ]);

    res.json(slots);

  } catch (error) {
    console.error('Get swappable slots error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/swap-request', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { mySlotId, theirSlotId } = req.body;

    if (!mySlotId || !theirSlotId) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Both slot IDs are required' });
    }

    const [mySlot, theirSlot] = await Promise.all([
      Event.findOne({ _id: mySlotId, user_id: req.user.id, status: 'SWAPPABLE' }).session(session),
      Event.findOne({ _id: theirSlotId, status: 'SWAPPABLE' }).session(session)
    ]);

    if (!mySlot) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Your slot is not available for swapping' });
    }

    if (!theirSlot) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Target slot is not available for swapping' });
    }

    if (theirSlot.user_id === req.user.id) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot swap with your own slot' });
    }

    await Promise.all([
      Event.findByIdAndUpdate(mySlotId, { status: 'SWAP_PENDING' }).session(session),
      Event.findByIdAndUpdate(theirSlotId, { status: 'SWAP_PENDING' }).session(session)
    ]);

    const swapRequest = new SwapRequest({
      requester_slot_id: mySlotId,
      target_slot_id: theirSlotId
    });

    await swapRequest.save({ session });
    await session.commitTransaction();

    res.status(201).json({ 
      message: 'Swap request created successfully',
      requestId: swapRequest._id 
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Swap request error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    session.endSession();
  }
});

app.post('/api/swap-response/:requestId', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const { accepted } = req.body;

    if (typeof accepted !== 'boolean') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Accepted field (boolean) is required' });
    }

    const swapRequest = await SwapRequest.findOne({ 
      _id: requestId, 
      status: 'PENDING' 
    }).session(session);

    if (!swapRequest) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Swap request not found or already processed' });
    }

    const targetSlot = await Event.findOne({ 
      _id: swapRequest.target_slot_id 
    }).session(session);

    if (!targetSlot || targetSlot.user_id !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Not authorized to respond to this swap request' });
    }

    if (!accepted) {
      await Promise.all([
        Event.findByIdAndUpdate(swapRequest.requester_slot_id, { status: 'SWAPPABLE' }).session(session),
        Event.findByIdAndUpdate(swapRequest.target_slot_id, { status: 'SWAPPABLE' }).session(session)
      ]);

      swapRequest.status = 'REJECTED';
      swapRequest.responded_at = new Date();
      await swapRequest.save({ session });

      await session.commitTransaction();
      res.json({ message: 'Swap request rejected' });

    } else {
      const requesterSlot = await Event.findOne({ 
        _id: swapRequest.requester_slot_id 
      }).session(session);

      await Promise.all([
        Event.findByIdAndUpdate(swapRequest.requester_slot_id, { 
          user_id: targetSlot.user_id,
          status: 'BUSY'
        }).session(session),
        Event.findByIdAndUpdate(swapRequest.target_slot_id, { 
          user_id: requesterSlot.user_id,
          status: 'BUSY'
        }).session(session)
      ]);

      swapRequest.status = 'ACCEPTED';
      swapRequest.responded_at = new Date();
      await swapRequest.save({ session });

      await session.commitTransaction();
      res.json({ message: 'Swap accepted successfully' });
    }

  } catch (error) {
    await session.abortTransaction();
    console.error('Swap response error:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    session.endSession();
  }
});

app.get('/api/swap-requests/incoming', authenticateToken, async (req, res) => {
  try {
    const requests = await SwapRequest.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'target_slot_id',
          foreignField: '_id',
          as: 'target_slot'
        }
      },
      {
        $unwind: '$target_slot'
      },
      {
        $match: {
          'target_slot.user_id': req.user.id,
          status: 'PENDING'
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'requester_slot_id',
          foreignField: '_id',
          as: 'requester_slot'
        }
      },
      {
        $unwind: '$requester_slot'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'requester_slot.user_id',
          foreignField: '_id',
          as: 'requester'
        }
      },
      {
        $unwind: '$requester'
      },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          requester_slot_title: '$requester_slot.title',
          requester_slot_start: '$requester_slot.start_time',
          requester_slot_end: '$requester_slot.end_time',
          requester_name: '$requester.name'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(requests);

  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/swap-requests/outgoing', authenticateToken, async (req, res) => {
  try {
    const requests = await SwapRequest.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'requester_slot_id',
          foreignField: '_id',
          as: 'requester_slot'
        }
      },
      {
        $unwind: '$requester_slot'
      },
      {
        $match: {
          'requester_slot.user_id': req.user.id
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'target_slot_id',
          foreignField: '_id',
          as: 'target_slot'
        }
      },
      {
        $unwind: '$target_slot'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'target_slot.user_id',
          foreignField: '_id',
          as: 'target_user'
        }
      },
      {
        $unwind: '$target_user'
      },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          target_slot_title: '$target_slot.title',
          target_slot_start: '$target_slot.start_time',
          target_slot_end: '$target_slot.end_time',
          target_user_name: '$target_user.name'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(requests);

  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
});