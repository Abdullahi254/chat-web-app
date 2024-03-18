// entry to server
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });


const PORT = process.env.PORT || 5000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});