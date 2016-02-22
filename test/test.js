var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');
//var config = require('./config-debug');

describe('Routing', function() {
  var url = 'http://localhost:3000';
  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  before(function(done) {
    // In our tests we use the test db
    mongoose.connect('mongodb://localhost/instagram_bot_with_nodejs_test');
    done();
  });
  // use describe to give a title to your test suite, in this case the tile is "Account"
  // and then specify a function in which we are going to declare all the tests
  // we want to run. Each test starts with the function it() and as a first argument 
  // we have to provide a meaningful title for it, whereas as the second argument we
  // specify a function that takes a single parameter, "done", that we will use 
  // to specify when our test is completed, and that's what makes easy
  // to perform async test!
  describe('User', function() {
    it('should return error trying to save duplicate username', function(done) {
      var profile = {
        username: 'sagar',
        password: 'sagar@123'
      };
    request(url)
  .post('/users')
  .send(profile)
  .end(function(err, res) {
        request(url)
            .post('/users')
            .send(profile)
            .end(function(err, res) {
               if (err) {
                      throw err;
                    }
                    // this is should.js syntax, very clear
                    console.log(res.body);
                    should.equal(res.body.message, 'username already taken!!!');
                done();     
            });
        });
    });

    it('should return access token if signed in with correct credentials', function(done){
      var profile = {
        username: 'sagar',
        password: 'sagar@123'
      };
      request(url)
      .post('/users/sign_in')
      .send(profile)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        console.log(res.body['access-token']);
        res.body['access-token'].should.matchEach(/[a-z0-9]/);
        done();
      })
    })

    it('should return error if user credentials did not matched', function(done){
      var profile = {
        username: ';lkajdfa',
        password: 'lahdfa'
      };
      request(url)
      .post('/users/sign_in')
      .send(profile)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        console.log(res.body);
        should.equal(res.body.message, 'user not found');
        done();
      })
    })
  });
});
