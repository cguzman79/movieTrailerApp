var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('movies', ['trailers']);

var app = express();

var MongoClient=require('Mongodb').MongoClient,format = require('util').format;
var dbUrl = 'mongodb://localhost:27017/movies';

var mongoose = require('mongoose'), SchemaName = mongoose.SchemaName;
mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl, {useNewUrlParser: true, promiseLibrary: require('bluebird') })
	.then(() =>  console.log('Connection Successful!!!'))
	.catch((err) => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/movies',function(req, res){
	console.log("I received a GET request!")
	
	db.trailers.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
	
});

app.post('/movies', function(req, res){
	console.log(req.body);
	db.trailers.insert(req.body, function(err,doc){
		res.json(doc);
	});
});

app.delete('/movies/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.trailers.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
		res.json(doc);		
	})
});

app.get('/movies/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.trailers.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
		res.json(doc);		
	})
});

app.put('/movies/:id', function(req, res){
	var id = req.params.id;
	console.log(req.body.name);
	db.trailers.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, description: req.body.description, url: req.body.url}},
		new: true}, function(err, doc){
			res.json(doc);
		});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});



module.exports = app;