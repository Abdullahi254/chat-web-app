// entry to server
require("dotenv").config();
const express = require('express');
const routes = require('./routes');
const app = express();
app.use(express.json());

const PORT = 5000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});