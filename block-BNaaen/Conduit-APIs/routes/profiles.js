var express = require('express');
var User = require('../models/User');
var auth = require('../middlewares/auth');
var router = express.Router();

router.get('/:username', async (req, res, next) => {
    var username = req.params.username;
    var user = await User.findOne({username});
    res.json({profile:{
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: user.following
    }})
})

module.exports = router;
