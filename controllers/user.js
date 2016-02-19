var UserModel = require('../models/user')
    , unirest = require('unirest')
    , url = require('url')
    , constants = require('../config/constants');
module.exports = {
  Index: function(callback) {
    UserModel.find(function (err, users) {
      if (err) return callback(err);
      callback(null, users);
    })
  },

  Show: function(username, callback) {
    UserModel.findOne({ 'username': username }, function (err, user) {
      if(user){
        callback(null, user);
      }else{
        callback(null,'user not found');
      }
    })
  },

  SignUp: function(req, res, callback) {
    UserModel.findOne({ 'username': req.body.username }, function (err, user) {
      if(user == null){
        var user = new UserModel(req.body);
        user.save(function (err) {
          if(err){
            res.json({'save': false});
          }else{
          // saved!
          res.json({'save': true});
          }
        })
      }else if(user.username == req.body.username){
        res.json({'message': 'username already taken!!!'});
      }
    })
  }, 

  SignIn: function(req, res, callback) {
    token =  Math.random().toString(36).substr(2);
    UserModel.findOneAndUpdate({ username: req.body.username },{token: token}, function (err, user){
      if(user.password == req.body.password){
        res.json({'access-token': token});
      }else{
        res.json({'user': 'not found'});
      }
    });
  },

// Register user via instagram oauth
// https://www.instagram.com/oauth/authorize/?client_id=...&redirect_uri=http://localhost:3000/users/instagram/callback&response_type=code&scope=likes+comments+relationships+follower_list+public_content+basic
  InstagramUserAuthentication: function(req, res, callback) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var state = query.state
    unirest.post('https://api.instagram.com/oauth/access_token')
    .header('Accept', 'application/json')
    .send({ "client_id": constants.ClientId,
            "client_secret": constants.ClientSecret,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:3000/users/instagram/callback",
            "code": query.code,
            "scope": "likes+comments+relationships+follower_list+public_content+basic" })
    .end(function (response) {
        UserModel.findOne({ 'accounts.user.id': response.body.user.id }, function (err, account){
          if(account){
            res.json({'message': 'Account already added'})
          }else if(state){
              UserModel.findOne({ token: state}, function (err, user){
                  if (user != null){
                      user.accounts.push(response.body)
                      user.save(function (err) {
                        if (err) return handleError(err)
                        res.json({'message': 'Account added successfully!!!'})
                      });
                  }else{
                      res.json({'message': 'User not found'});
                  }
              })
          }else{
            // New user registration
              var a = new UserModel({ accounts: response.body })
              a.save(function (err) {
                  if(err != null){
                      res.json({'message': err.message})
                  }else{
                      res.json({'message':'User created successfully'})
                  }
              })
          }
        })
    });
  },  
};
