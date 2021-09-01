var express = require('express');
var User = require('../models/User');
var multer = require('multer');
var path = require('path');

var router = express.Router();

const uploadpath = path.join(__dirname , '..', 'uploads');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadpath)
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({storage});

/* REGISTER users */
router.post('/', upload.single('image'), async (req, res, next) => {
  req.body.image = req.file.filename;
   try{
    var user = await User.create(req.body);
    let token = await user.signToken();
    res.json({user: await user.userJSON(token)})
   }catch(error){
     next(error);
   }
});

// LOGIN users 
router.get('/login', async (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) return res.status(400).json({error: "Email/Password required!"});
  try {
    let user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Email is not registered"});
    let result = await user.verifyPassword(password);
    if(!result) return res.status(400).json({error: "Password is invalid"});
    let token = await user.signToken();
    console.log(token);
    res.json({user: await user.userJSON(token)})
  } catch (error) {
    next(error);
  }
})

module.exports = router;
