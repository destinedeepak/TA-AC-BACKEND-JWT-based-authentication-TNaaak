var express = require('express');
var slug = require('slug');
var User = require('../models/User');
var Article = require('../models/Article');
var Comment = require('../models/Comment')
var auth = require('../middlewares/auth');
var mongoose = require('mongoose');
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

  //   Feed articles
router.get('/feed',auth.verifyToken, async (req, res, next) => {
    try {
        var limit = +req.query.limit || 20;
        var offset = req.query.offset || 0;
        let followedAuthors = await User.distinct('following',{_id:req.user.userId});
        let feeds = await Article.find({author:followedAuthors}).limit(limit).skip(offset).exec();
        return res.send(feeds)
    } catch (error) {
        next(error)
    }
}) 

  // get single article
router.get('/:slug',async (req, res, next) => {
    var slug = req.params.slug;
    try {
        let article = await Article.findOne({slug}).populate('author').exec();
        return res.send({article})
    } catch (error) {
        next(error);
    }
  });

    // get all articles
router.get('/',async (req, res, next) => {
    try {
        var limit = +req.query.limit || 20;
        var offset = req.query.offset || 0;
        // filter by tag 
        if(req.query.tag){
            let articles = await Article.find({tagList:{$in:[req.query.tag]}}).populate('author').exec();
            if(articles.length === 0) return res.status(400).json({error:"tag not found"})
            return res.send(articles);
        }
           // filter by author     
        if(req.query.author){
            var author = await User.findOne({username:req.query.author});
            if(!author) return res.status(400).json({error:"author not found"});
            let articles = await Article.find({author:author.id}).populate('author').exec();
            if(articles.length === 0) return res.status(400).json({error:`No articles found for ${req.query.author}`});
            return res.send(articles)
        }
            //filter by favorited

            // all articles 
        let articles = await Article.find({}).populate('author').limit(limit).skip(offset).exec();
            if(articles.length === 0) return res.status(400).json({error:"Articles not found"})
            return res.send(articles)

    } catch (error) {
        next(error);
    }
  });

// delete articles 
router.delete('/:slug', auth.verifyToken,async (req, res, next) => {
    var slug = req.params.slug;
    try {
        var deletedArticle = await Article.findOne({slug});
        if(!deletedArticle) return res.status(400).json('No articles found to delete');
        var deletedArticle = await Article.findByIdAndDelete(deletedArticle);
        await Comment.deleteMany({article: deletedArticle._id});
        res.send(deletedArticle);
    } catch (error) {
        next(error);
    } 
})

// COMMENTS
// add Comments 
router.post('/:slug/comments',auth.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;
    req.body.author = req.user.userId;
    try {
        let article = await Article.findOne({slug});
        if(!article) return res.status(400).json("No such article found");
        req.body.article = article.id;
        var comment = await Comment.create(req.body);
        await Article.findByIdAndUpdate(article.id, {$push:{comments:comment.id}}, {new: true});
        res.send(comment);
    } catch (error) {
        next(error);
    }
})

//get comments from an article
router.get('/:slug/comments', async (req, res, next) =>{
    var slug = req.params.slug;
    try {
        let articles = await Article.findOne({slug},'comments').populate('comments');
        res.send({comments:articles.comments})
    } catch (error) {
        
    }
})

// Favorite Articles 
router.post('/:slug/favorite', auth.verifyToken,async (req, res, next) => {
    try {
        var slug = req.params.slug;
        var article = await Article.findOneAndUpdate(
            {slug},
            {$push:{favorited: req.user.userId},$inc:{favoritesCount:1}},
            {new: true}
        );
        if(!article) return res.status(400).json("No such article found");
        res.send(article);
    } catch (error) {
        next(error);
    }
})

// UnFavorite Articles 
router.delete('/:slug/favorite', auth.verifyToken,async (req, res, next) => {
    try {
        var slug = req.params.slug;
        var article = await Article.findOneAndUpdate(
            {slug},
            {$pull:{favorited: req.user.userId},$inc:{favoritesCount:-1}},
            {new: true}
        );
        if(!article) return res.status(400).json("No such article found");
        res.send(article);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
