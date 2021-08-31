var express = require('express');
var slug = require('slug');
var User = require('../models/User');
var Article = require('../models/Article');
var auth = require('../middlewares/auth');
var router = express.Router();

// create Article 
router.post('/', auth.verifyToken, async (req, res, next) => {
    req.body.tagList = req.body.tagList.split(',').map((ele) => ele.trim());
    req.body.author = req.user.userId;
    try {
        req.body.slug = await slug(req.body.title);
        var article = await Article.create(req.body);
        res.json({article});
    } catch (error) {
        next(error);
    }
  });

  // get single article
router.get('/:slug',async (req, res, next) => {
    let slug = req.params.slug;
    try {
        let article = await Article.findOne({slug}).populate('author').exec();
        return res.send({article})
    } catch (error) {
        next(error);
    }
  });

    // get all articles
router.get('/',async (req, res, next) => {
    if(req.query && req.query.tag){
        return res.send(req.query)
    }
    try {
        let articles = await Article.find().populate('author').exec();
        return res.send({articles})
    } catch (error) {
        next(error);
    }
  });


module.exports = router;
