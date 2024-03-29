
var mongoose = require('mongoose')
//  , Imager = require('imager')
  , async = require('async')
  , Article = mongoose.model('Article')
  , _ = require('underscore')


// Edit an article
exports.index = function (req, res) {
  res.render('/', {
    title: 'Edit '+req.article.title,
    article: req.article
  })
}


// New article
exports.new = function(req, res){
  res.render('articles/new', {
      title: 'New Article'
    , article: new Article({})
  })
}


// Create an article
exports.create = function (req, res) {
  var article = new Article(req.body)
    , imagerConfig = require('../../config/imager')
    , imager = new Imager(imagerConfig, 'S3')

  article.user = req.user

  imager.upload(req.files.image, function (err, cdnUri, files) {
    if (err) return res.render('400')
    if (files.length) {
      article.image = { cdnUri : cdnUri, files : files }
    }
    article.save(function(err){
      if (err) {
        res.render('articles/new', {
            title: 'New Article'
          , article: article
          , errors: err.errors
        })
      }
      else {
        res.redirect('/articles/'+article._id)
      }
    })
  }, 'article')
}


// Edit an article
exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit '+req.article.title,
    article: req.article
  })
}


// Update article
exports.update = function(req, res){
  var article = req.article

  article = _.extend(article, req.body)

  article.save(function(err, doc) {
    if (err) {
      res.render('articles/edit', {
          title: 'Edit Article'
        , article: article
        , errors: err.errors
      })
    }
    else {
      res.redirect('/articles/'+article._id)
    }
  })
}


// View an article
exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article,
    comments: req.comments
  })
}


// Delete an article
exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/articles')
  })
}


// Listing of Articles
exports.index = function(req, res){
  var perPage = 5
    , page = req.param('page') > 0 ? req.param('page') : 0

  Article
    .find({})
    .populate('user', 'name')
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, articles) {
      if (err) return res.render('500')
      Article.count().exec(function (err, count) {
        res.render('articles/index', {
            title: 'List of Articles'
          , articles: articles
          , page: page
          , pages: count / perPage
        })
      })
    })
}

// find requested article
exports.article = function(req, res, next, id){
  var User = mongoose.model('User')

  Article
    .findOne({ _id : id })
    .populate('user', 'name')
    .populate('comments')
    .exec(function (err, article) {
      if (err) return next(err)
      if (!article) return next(new Error('Failed to load article ' + id))
      req.article = article

      var populateComments = function (comment, cb) {
        User
          .findOne({ _id: comment._user })
          .select('name')
          .exec(function (err, user) {
            if (err) return next(err)
            comment.user = user
            cb(null, comment)
          })
      }

      if (article.comments.length) {
        async.map(req.article.comments, populateComments, function (err, results) {
          next(err)
        })
      }
      else
        next()
    })
}
