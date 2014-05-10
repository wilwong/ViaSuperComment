
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("DB IS OPENED");
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(__dirname + '/public'));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/post-comment', function(req, res) {
  var entry = {
    _id: new mongoose.Types.ObjectId(),
    posted: req.body.posted,
    fbid: req.body.fbid,
    name: req.body.name,   
    position: req.body.position,
    text: req.body.text
    
  };
  collectionName = "Comments-" + req.body.mgid;
  console.log("writing entry:" + entry._id + " to Comment:" + req.body.mgid );
  db.collection(collectionName).insert(entry, function(err, result) {
    //err callback      
  });
});

app.get('/get-comment', function(req,res){
  
  db.collection("Comments-" + req.query.mgid).find().sort({'position':-1}).toArray(function(err, docs){
    console.log("Commets-" + req.query.mgid);
    var json = JSON.stringify(docs);;
    res.send(json);
  });
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
