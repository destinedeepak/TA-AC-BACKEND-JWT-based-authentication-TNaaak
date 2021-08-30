var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.post('/register',async function(req, res, next) {
  try{
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.json({user: user.userJSON()})
  }catch(error){
    next(error);
  }
});

// POST user 
router.get('/login', async (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "Email/Password is required!"})
  }
  try{
    var user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "Email not registered!"})
    }
    var result =  await user.verifyPassword(password);
    if(!result){
      return res.status(400).json({error: "Password is invalid!"})
    }
    // generate tokens 
    var token = await user.signToken();
    res.json({user: user.userJSON(token)})
  }catch(error){
    next(error)
  }
}) 

module.exports = router;
