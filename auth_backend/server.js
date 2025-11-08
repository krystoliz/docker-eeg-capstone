require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// --- User Model ---
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // <-- ADD THIS LINE
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// --- NEW (Phase 5): EmotionData Model ---
// This schema MUST match the data being saved by FastAPI
const EmotionDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classified_emotion: { type: String, required: true },
  analysis_timestamp: { type: Number, required: true },
  savedAt: { type: Date, default: Date.now },
  
  // --- THIS SCHEMA IS NOW UPDATED ---
  original_data: {
    timestamp: Number,
    sr: Number,
    num_samples: Number
  },
  
  // --- ADD THIS NEW FIELD ---
  key_features: {
    alpha: Number,
    beta: Number,
    asymmetry: Number
  }
  // -----------------------------
}, {
  collection: 'emotiondata' 
});
const EmotionData = mongoose.model('EmotionData', EmotionDataSchema);

// --- NEW (Phase 5): Auth Middleware ---
// A simple middleware to protect our new route
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Add user payload to the request object
    next(); // Move on to the next function (the route handler)
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// --- Auth Routes (Unchanged) ---

// 1. Register
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body; // <-- ADD fullName
    if (!email || !password || !fullName) { // <-- ADD fullName
      return res.status(400).json({ message: 'Full name, email, and password are required' }); // <-- UPDATE MESSAGE
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword, fullName }); // <-- ADD fullName
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// 2. Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // PRD: Issue JWT Token
    const token = jwt.sign(
      // --- ADD fullName to the token payload ---
      { userId: user._id, email: user.email, fullName: user.fullName },
      // ----------------------------------------
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- NEW (Phase 5): History Route ---
// This route is protected by our authMiddleware
app.get('/auth/history', authMiddleware, async (req, res) => {
  try {
    // req.user was added by the authMiddleware
    const userId = req.user.userId;

    // Find all emotion data for this user, sort by most recent
    const history = await EmotionData.find({ userId: userId })
                                     .sort({ savedAt: -1 })
                                     .limit(50); // Get the 50 most recent entries

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// --- Start Server ---
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Auth Backend (Express) listening on port ${PORT}`);
});