const express = require('express');
const router = require('./router/routes');
const app = express();
const { createTables } = require('./db/db');
require('dotenv').config(); // Load environment variables from .env file

app.use(router);

const PORT = process.env.PORT || 3002;

// creating the db before starting the server
createTables().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
