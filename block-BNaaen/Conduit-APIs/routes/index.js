var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/',auth.verifyToken, function(req, res, next) {
  res.json({index:"index"});
});

module.exports = router;
