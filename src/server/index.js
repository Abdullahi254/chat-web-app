// entry to server
require("dotenv").config();
const express = require('express');
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors');


const routes = require('./routes');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 5000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});