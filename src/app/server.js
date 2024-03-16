const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const routes = require("./api/routes/index");

const { dbConnect } = require('./lib/db');

const app = express();
require('dotenv').config({ path: '.env.local' });

app.use(express.json());
app.use(cors());
app.use("/api/users", routes);

const port = process.env.PORT || 5000;
app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});

dbConnect();