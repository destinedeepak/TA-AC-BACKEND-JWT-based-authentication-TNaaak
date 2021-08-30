var express = require('express');
var auth = require('../middlewares/auth')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth.verifyToken, (req, res, next) => {
  res.json({access:"Dashboard"});
})

module.exports = router;
