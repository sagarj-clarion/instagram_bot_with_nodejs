var express = require('express')
    , unirest = require('unirest')
    , url = require('url')
    , router = express.Router()
    , UserController = require('../controllers/user')
    , User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  UserController.Index(function(err, data) {
    res.json({'data': data});  
  });
})

/* Get user details */
router.get('/:id', function(req, res) {
  UserController.Show(req.params.id, function(err, data) {
    res.json({'data': data});  
  });
});

/* User sign up */
router.post('/', function(req, res){
  UserController.SignUp(req, res, function(err, data){
  })
})

/* User sign in */
router.post('/sign_in', function(req, res){
  UserController.SignIn(req, res, function(err, data){
  })
})

/* User sign up via instagram or attach instagram account with existing account*/
router.get('/instagram/callback', function(req, res){
  UserController.InstagramUserAuthentication(req, res, function(err, data){
  })
})

module.exports = router;
