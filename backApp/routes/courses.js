var express = require('express');
var router = express.Router();
const { MongoClient } = require("mongodb");

const { DB_URL } = require('./consts.json')
const client = new MongoClient(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* GET Courses listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Functions */

module.exports = router;
