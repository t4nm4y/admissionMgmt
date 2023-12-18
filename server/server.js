const express = require('express');
const router = require('./router/routes');
const app = express();
const cors = require('cors');
const { createTables } = require('./db/db');
const bodyParser = require('body-parser'); //for parsing the request.body at api endpoints
const dotenv = require('dotenv'); // to read form .env file 
dotenv.config(); //to load the variables from .env file

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use(router);
const PORT = process.env.PORT || 3002;

// creating the db before starting the server
createTables().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
