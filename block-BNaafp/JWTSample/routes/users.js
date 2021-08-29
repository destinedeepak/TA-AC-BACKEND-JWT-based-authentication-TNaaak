var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.post('/register',async function(req, res, next) {
  try{
    var user = await User.create(req.body);
    res.status(201).json({user});
  }catch(error){
    next(error);
  }
});

// POST user 
router.get('/login', async (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "Email/Password is invalid!"})
  }
  try{
    var user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "Email not registered!"})
    }
    var result =  user.verifyPassword(password);
    return res.json(user.verifyPassword)
  }catch(error){
    next(error)
  }
}) 

module.exports = router;
