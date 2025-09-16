const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const userRoutes = require('./routes/userRoutes')
const path = require('path');

const app = express();
const PORT = 5000;

require('dotenv').config(); // Make sure you have a .env file with MONGO_URI

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes); 
app.use('/api/user', userRoutes); 
// (Optional) To serve HTML files if needed
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo Error", err));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});



