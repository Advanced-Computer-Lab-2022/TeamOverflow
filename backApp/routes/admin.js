var express = require('express');
var router = express.Router();

/* GET admins listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* Functions */

module.exports = router;