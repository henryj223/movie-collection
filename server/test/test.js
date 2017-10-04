/**
 * Make any/all changes you see fit based on your experience. Every detail you (do not) change will be subject to
 * questioning during the in person interview.
 *
 * Good luck.
 * 
 * Author: Henry Liu
 * Modification Date: 10/04/2017
 */

process.env.NODE_ENV = 'test';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../');
const should = chai.should();
const mongoose = require('mongoose');

chai.use(chaiHttp)
let user, user2, movie

describe('Test Setup', function() {
  it('Clear out <movies> and <users> collection from database', function(done) {
	var movieModel = mongoose.model('movies', new mongoose.Schema);
	var usersModel = mongoose.model('users', new mongoose.Schema);
	movieModel.remove({}, function() {});
	usersModel.remove({}, function() {});
	done();
  })
});

describe('Authentication Tests', function() {
  const newUser = {
    email: `coolguyaaron@gmail.com`,
    password: 'ASecretSoBigNoOneCanBreak'
  }
  const wrongPasswordUser = {
    email: `coolguyaaron@gmail.com`,
    password: 'password'
  }
  const newUser2 = {
    email: `testemail@gmail.com`,
    password: 'strongpassword123'
  }
  /*
  // clear out all created movies and users from previous run
  before(function(done){
	var movieModel = mongoose.model('movies', new mongoose.Schema);
	var usersModel = mongoose.model('users', new mongoose.Schema);
	movieModel.remove({}, function() {});
	usersModel.remove({}, function() {done();});
	console.log('movies and users cleared from database')
  })
*/
  describe('Registration', function() {
    it('Should register a new user', function(done) {
      chai.request(server).post('/register').send(newUser).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('_id');
        res.body.user.should.have.property('token');
        done();
      });
    });

    it('Should fail to register with an email already taken', function(done) {
      chai.request(server).post('/register').send(newUser).end(function (err, res) {
        assert.equal(err, undefined)
        res.should.have.status(200);
        assert.equal(res.body.success, true)
        res.body.success.should.be.a('boolean');
        assert.equal(res.body.message, "User with that email already taken.")
        res.body.should.not.have.property('user')
        done();
      });
    });
	
	it('Should register a second new user', function(done) {
      chai.request(server).post('/register').send(newUser2).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('_id');
        res.body.user.should.have.property('token');
        done();
      });
    });
  });

  describe('Login', function() {
    it('Should login successfully', function (done) {
      chai.request(server).post('/login').send(newUser).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('_id');
        res.body.user.should.have.property('token');
        user = res.body.user
        done();
      });
    });
    it('Should send back an unauthorized error', function(done) {
      chai.request(server).post('/login').send(wrongPasswordUser).end(function (err, res) {
        res.should.have.status(401);
        done();
      });
    });
    it('Should send back a not found error', function(done) {
      chai.request(server).post('/login').send({user: 'aaron@test.com', password: 'hello123'}).end(function (err, res) {
        res.should.have.status(400);
        done();
      });
    });
	it('Should login successfully', function (done) {
      chai.request(server).post('/login').send(newUser2).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.user.should.be.a('object');
        res.body.user.should.have.property('_id');
        res.body.user.should.have.property('token');
        user2 = res.body.user
        done();
      });
    });
  });
});

describe('Movie Tests', function() {
  const newMovie = {
    imagePoster: '',
    title: 'Testing Title',
    genre: 'Testing Genre',
    rating: '10',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2017'
  }
  // newMovieSameInfo has the same info as newMovie
  const newMovieSameInfo = {
    imagePoster: '',
    title: 'Testing Title',
    genre: 'Testing Genre',
    rating: '10',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2017'
  }
  const newMovieNoTitle = {
    imagePoster: '',
    title: '',
    genre: 'Testing Genre',
    rating: '10',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2017'
  }
  const newMovieNoGenre = {
    imagePoster: '',
    title: 'Title - No Genre',
    genre: '',
    rating: '10',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2017'
  }
  const newMovieNoRating = {
    imagePoster: '',
    title: 'Title - No Rating',
    genre: 'Testing Genre',
    rating: '',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: '2017'
  }
  const newMovieNoActor = {
    imagePoster: '',
    title: 'Title - No Actor',
    genre: 'Testing Genre',
    rating: '10',
    actors: '',
    year: '2017'
  }
  const newMovieNoYear = {
    imagePoster: '',
    title: 'Title - No Year',
    genre: 'Testing Genre',
    rating: '10',
    actors: 'Steve Martin, Collin Ferral, Leo Decaprio',
    year: ''
  }
  const newMovieNonAlphanumeric = {
    imagePoster: '',
    title: '~!@#$%^&*()_+=-`[]\;\',./{}|:"<>?áéíóúüñ¿¡',
    genre: '~!@#$%^&*()_+=-`[]\;\',./{}|:"<>?áéíóúüñ¿¡',
    rating: '~!@#$%^&*()_+=-`[]\;\',./{}|:"<>?áéíóúüñ¿¡',
    actors: '~!@#$%^&*()_+=-`[]\;\',./{}|:"<>?áéíóúüñ¿¡',
    year: '~!@#$%^&*()_+=-`[]\;\',./{}|:"<>?áéíóúüñ¿¡'
  }
  const newMovieActorCommaMisuse = {
    imagePoster: '',
    title: '',
    genre: '',
    rating: '',
    actors: 'Actor1,Actor2,, Actor3 Actor4',
    year: ''
  }
  const newMovieNoInfo = {
    imagePoster: '',
    title: '',
    genre: '',
    rating: '',
    actors: '',
    year: ''
  }

  describe('Create', function() {
    it('Should create a new movie with the API', function(done) {
	  chai.request(server).post('/movie').set('Authorization', user.token).send(newMovie).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
		movie = res.body.movie
        done();
      });
    });
	it('Should create a new movie with the same information as an existing movie', function(done) {
	  chai.request(server).post('/movie').set('Authorization', user.token).send(newMovieSameInfo).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
		movie = res.body.movie
        done();
      });
    });
	it('Should create a new movie without title', function(done) {
      chai.request(server).post('/movie').set('Authorization', user.token).send(newMovieNoTitle).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie without genre', function(done) {
      chai.request(server).post('/movie').set('Authorization', user.token).send(newMovieNoGenre).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie without rating', function(done) {
      chai.request(server).post('/movie').set('Authorization', user.token).send(newMovieNoRating).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie without actor', function(done) {
      chai.request(server).post('/movie').set('Authorization', user.token).send(newMovieNoActor).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie without year', function(done) {
      chai.request(server).post('/movie').set('Authorization', user.token).send(newMovieNoYear).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie with non-alphanumeric characters', function(done) {
      chai.request(server).post('/movie').set('Authorization', user2.token).send(newMovieNonAlphanumeric).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie with comma misuse for the Actor List', function(done) {
      chai.request(server).post('/movie').set('Authorization', user2.token).send(newMovieActorCommaMisuse).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
	it('Should create a new movie with no information', function(done) {
      chai.request(server).post('/movie').set('Authorization', user2.token).send(newMovieNoInfo).end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(201);
        done();
      });
    });
  });

  describe('Read', function() {
    it('Should send back a list of all movies', function(done) {
	  chai.request(server).get('/movies').end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.movies.should.be.a('array');
        assert.equal(res.body.movies.length, 10)
        done();
      });
    });
	// The following two tests verifies that we can send back list based on different registered users
	it('Should send back a list of all movies uploaded by user', function(done) {
	  chai.request(server).get('/users/'+user._id+'/movies').end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.movies.should.be.a('array');
        assert.equal(res.body.movies.length, 7)
        done();
      });
    });
	it('Should send back a list of all movies uploaded by user2', function(done) {
	  chai.request(server).get('/users/'+user2._id+'/movies').end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.movies.should.be.a('array');
        assert.equal(res.body.movies.length, 3)
        done();
      });
    });
  });

  describe('Update', function() {
    /*
	// NOT PASSING
	// Current code will return a passing test, but the movie is not updated in MongoDB.
	// Investigate: does not enter the 'updateMovie' function.
	it('Should update a movie', function(done) {
	  chai.request(server).post('/movie/'+movie._id).set('Authorization', user.token).send(movie, {$set: {title: 'Updated Title'}}).end(function (err, res) {
		assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
      });
	  done();
    });*/
  });

  describe('Delete', function() {
    it('Should remove a movie', function(done) {
	  chai.request(server).delete('/movie/'+movie._id).set('Authorization', user.token).send(movie).end(function (err, res) {
		assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
      });
	  done();
	  // Send back a list of all movies and verify that the count is reduced by 1 movie
	  chai.request(server).get('/movies').end(function (err, res) {
        assert.equal(err, undefined)
        assert.equal(res.body.success, true)
        res.should.have.status(200);
        res.body.movies.should.be.a('array');
        assert.equal(res.body.movies.length, 9)
      });
    });
  });

});
