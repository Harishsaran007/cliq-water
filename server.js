const express = require('express');

const dotenv = require('dotenv');
const cliqRoute = require('./routes/cliqRoute'); // ✅ IMPORTANT

dotenv.config();

const app = express();

// (if you use JSON body anywhere)
app.use(express.json());


// ✅ SIMPLE TEST ROUTE
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ✅ MOUNT CLIQ ROUTE HERE
app.use('/api/cliq', cliqRoute);  // 🔥 THIS LINE MAKES YOUR URL

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
