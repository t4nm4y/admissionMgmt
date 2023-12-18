const express = require('express');
const router = express.Router();
const { getBatches, getUsers, addUser, changeBatchByUser, getUsersWithPendingPayment,getUsersofBatch,
submitPaymentRequestByUser, getUsersWithCompletedPayment, deleteUser, login, fetchAll, getUserDetails } = require('../controllers/controllers');

router.post('/login', login)
router.get('/getBatches', getBatches);
router.get('/getUserDetails/:user_name', getUserDetails);
router.post('/addUser', addUser);

//only admin can preform these
router.get('/getUsers', getUsers);
router.get('/getUsersWithPendingPayment', getUsersWithPendingPayment);
router.get('/getUsersWithCompletedPayment', getUsersWithCompletedPayment);
router.get('/getUsersofBatch/:batch_id', getUsersofBatch);

//user can perfrom these
router.put('/changeBatch', changeBatchByUser);
router.get('/submitPayment/:user_name', submitPaymentRequestByUser);
router.get('/deleteUser/:user_name', deleteUser);

//to fetch everything
router.get('/all', fetchAll);

module.exports = router;
