const express = require('express');
const router = express.Router();
const { getBatches, getUsers, addUser, changeBatchByUser, getUsersWithPendingPayment,
    submitPaymentRequestByUser, getUsersWithCompletedPayment, deleteUser } = require('../controllers/controllers');

router.get('/getBatches', getBatches);
router.get('/getUsers', getUsers);
router.post('/addUser', addUser);
router.put('/changeBatch', changeBatchByUser);
router.get('/getUsersWithPendingPayment', getUsersWithPendingPayment);
router.put('/submitPayment', submitPaymentRequestByUser);
router.get('/getUsersWithCompletedPayment', getUsersWithCompletedPayment);
router.delete('/deleteUser', deleteUser);


module.exports = router;
