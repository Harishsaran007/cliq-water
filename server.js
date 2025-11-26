const express = require('express');

const dotenv = require('dotenv');
const cliqRoute = require('./routes/cliqRoute'); 

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});


app.use('/api/cliq', cliqRoute);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
