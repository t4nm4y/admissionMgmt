const express = require('express');
const router = express.Router();
const { getBatches }=require('../controllers/controllers');

router.get('/getBatches', getBatches);

module.exports = router;
