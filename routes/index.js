const express = require('express');
const router = express.Router();
const ProductsController = require('../app/controllers/ProductsController');
const {route} = require("express/lib/application");

router.get('/catalog/search', ProductsController.search);

module.exports = router;
