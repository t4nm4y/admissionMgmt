const express = require('express');
const router = express.Router();
const { getBatches, getUsers, addUser, changeBatchByUser, getUsersWithPendingPayment,
submitPaymentRequestByUser, getUsersWithCompletedPayment, deleteUser, login, describe, getUserDetails } = require('../controllers/controllers');

const auth = require('../middleware/auth.js')
// const jwtAuth = require('../middleware/jwtAuth.js')

router.post('/login', auth, login)
router.get('/getBatches', getBatches);
router.get('/getUserDetails/:username', getUserDetails);
router.post('/addUser', addUser);

//only admin can preform these
router.get('/getUsers', getUsers);
router.get('/getUsersWithPendingPayment', getUsersWithPendingPayment);
router.get('/getUsersWithCompletedPayment', getUsersWithCompletedPayment);

//user can perfrom these
router.put('/changeBatch', changeBatchByUser);
router.get('/submitPayment/:username', submitPaymentRequestByUser);
router.get('/deleteUser/:username', deleteUser);

//describe db
router.get('/', describe);

module.exports = router;
