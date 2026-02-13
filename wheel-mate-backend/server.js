/*
This is your UPDATED backend server.
All configuration is now loaded from .env file
*/
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Configuration ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Load from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "myprojectisduetomorrowandthisisasecret";
const MONGO_URI = process.env.MONGO_URI;

// Validate required environment variables
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in .env file!');
  process.exit(1);
}

console.log('Configuration loaded:');
console.log('- PORT:', PORT);
console.log('- JWT_SECRET:', JWT_SECRET ? 'Set ✓' : 'Missing ✗');
console.log('- MONGO_URI:', MONGO_URI ? 'Set ✓' : 'Missing ✗');

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully.');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });

// --- Mongoose Schemas ---

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

// Facility Schema
const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['hospital', 'police', 'restaurant', 'repair', 'toilet', 'other'] },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  notes: { type: String, default: '' },
  accessible: { type: Boolean, default: true },
  ratings: { type: [Number], default: [] },
  rating: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Facility = mongoose.model('Facility', facilitySchema);

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid.' });
  }
};

// --- API Routes ---

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = new User({ username, password });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: savedUser._id,
        username: savedUser.username
      }
    });
  
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error: Could not register user.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      id: user._id,
      username: user.username
    };
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({
      message: 'Logged in successfully!',
      token: token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error: Could not log in.' });
  }
});

// Facility Routes
app.get('/api/facilities', async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.json(facilities);
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ message: 'Server error: Could not fetch facilities.' });
  }
});

app.post('/api/facilities', authMiddleware, async (req, res) => {
  try {
    const { name, address, type, notes, lat, lng } = req.body;
    
    if (!name || !address || !type || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newFacility = new Facility({
      name,
      address,
      type,
      notes,
      lat: lat,
      lng: lng,
      accessible: true,
      ratings: [],
      rating: 0,
      addedBy: req.user.id
    });

    const savedFacility = await newFacility.save();
    res.status(201).json(savedFacility);
  } catch (err) {
    console.error('Error adding facility:', err);
    res.status(500).json({ message: 'Server error: Could not add facility.' });
  }
});

app.post('/api/facilities/:id/feedback', authMiddleware, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const facilityId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5.' });
    }

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    facility.ratings.push(rating);
    const sum = facility.ratings.reduce((acc, r) => acc + r, 0);
    const newAverage = sum / facility.ratings.length;
    facility.rating = newAverage;

    const updatedFacility = await facility.save();
    res.status(200).json(updatedFacility);

  } catch (err) {
    console.error('Error adding feedback:', err);
    res.status(500).json({ message: 'Server error: Could not add feedback.' });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.send('WHEEL-MATE API is running!');
});