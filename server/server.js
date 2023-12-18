const express = require('express');
const router = require('./router/routes');
const app = express();
const cors = require('cors');
const { pool, createTables } = require('./db/db');
const bodyParser = require('body-parser'); //for parsing the request.body at api endpoints
const dotenv = require('dotenv'); // to read form .env file 
dotenv.config(); //to load the variables from .env file

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use(router);

//update payment status on the first day of the month to 'pending'
const updatePaymentStatusOnFirstDay = async () => {
  try {
    const currentDate = new Date();
    const isFirstDayOfMonth = currentDate.getDate() === 1;

    if (isFirstDayOfMonth) {
      // Update payment status to 'pending' for all users
      const updatePaymentStatusQuery = `
        UPDATE "Users"
        SET payment_status = 'pending'
        RETURNING *`;

      const result = await pool.query(updatePaymentStatusQuery);

      console.log('Payment status updated to "pending" for all users.');
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
};

updatePaymentStatusOnFirstDay();

// Schedule the task to run daily ie. run every 24 hours
setInterval(updatePaymentStatusOnFirstDay, 24 * 60 * 60 * 1000);


const PORT = process.env.PORT || 3002;

// creating the db before starting the server
createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
