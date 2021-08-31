var express = require('express');
var User = require('../models/User');
var auth = require('../middlewares/auth');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const { token } = require('morgan');
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

// GET current user 
router.get('/',auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    res.json({user:{
        email:user.email,
        token:token,
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: user.following
    }})
  } catch (error) {
      res.json(error);
  }
})

// UPDATE current user 
router.put('/', auth.verifyToken, upload.single('image'), async (req, res, next) => {
    try {
        let user = await User.findById(req.user.userId);
        if(req.file && req.file.fieldname === 'image'){
            req.body.image = req.file.filename;
            let imageFilePath = await path.join(__dirname, '..', 'uploads', user.image);
            fs.unlink(imageFilePath,(error)=>{
                //how to use fs with async await??
                if(error)  return res.json({error});
            });
        }
        let updatedUser = await User.findByIdAndUpdate(user.id, req.body, {new: true});
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
