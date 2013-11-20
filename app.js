
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var oauth= require('oauth');

//TODO: move this to config
var _twitterConsumerKey = 'iBdzwo5AG7rRzXGvfjzTw';
var _twitterConsumerSecret = 'iiwGdZ6vJobqgsjnRMtAaACmdvvtAdlErDROKn2YKM';


var app = express();
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//store bearer token for future requests
var accessToken;
var OAuth2 = oauth.OAuth2;    
     var twitterConsumerKey = _twitterConsumerKey;
     var twitterConsumerSecret = _twitterConsumerSecret;
     var oauth2 = new OAuth2(twitterConsumerKey,
       twitterConsumerSecret, 
       'https://api.twitter.com/', 
       null,
       'oauth2/token', 
       null);
     oauth2.getOAuthAccessToken(
       '',
       {'grant_type':'client_credentials'},
       function (e, access_token, refresh_token, results){
       console.log('bearer: ',access_token);
       accessToken = access_token;
       loadTweets();
     });
 	
var http = require("http");
var baseUrl = "https://api.twitter.com/1.1/search/tweets.json";
var options;

function loadTweets(){
	options = {
	  host: "api.twitter.com",
	  port: 80,
	  path: "https://api.twitter.com/1.1/search/tweets.json?q=@noradio", //TODO: make this query parameter driven
	  headers: {
	    Authorization: 'Bearer ' + accessToken
	  }
	};
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
  		res.setEncoding('utf8');
	  	res.on('data', function (chunk) {
	    	console.log('BODY: ' + chunk);
	  	});
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
}

app.get('/tweets', function(req, res){
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write('{test: something}');
	res.end();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// app.get('/auth/twitter', passport.authenticate('twitter'));

// app.get('/auth/twitter/callback', 
//   passport.authenticate('twitter', { successRedirect: '/',
                                     // failureRedirect: '/login' }));
// app.get('/sessions/connect', function(req, res){
//   consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
//     if (error) {
//       res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
//     } else {  
//       req.session.oauthRequestToken = oauthToken;
//       req.session.oauthRequestTokenSecret = oauthTokenSecret;
//       res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
//     }
//   });
// });

// app.get('/sessions/callback', function(req, res){
//   sys.puts(">>"+req.session.oauthRequestToken);
//   sys.puts(">>"+req.session.oauthRequestTokenSecret);
//   sys.puts(">>"+req.query.oauth_verifier);
//   consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
//     if (error) {
//       res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
//     } else {
//       req.session.oauthAccessToken = oauthAccessToken;
//       req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
//       // Right here is where we would write out some nice user stuff
//       consumer.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
//         if (error) {
//           res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
//         } else {
//           req.session.twitterScreenName = data["screen_name"];    
//           res.send('You are signed in: ' + req.session.twitterScreenName)
//         }  
//       });  
//     }
//   });
// });


// var callbackUrl = "http://localhost:3000/authenticate";

// var passport = require('passport')
//   , TwitterStrategy = require('passport-twitter').Strategy;

// passport.use(new TwitterStrategy({
//     consumerKey: _twitterConsumerKey,
//     consumerSecret: _twitterConsumerSecret,
//     callbackURL: "http://localhost:3000/auth/twitter/callback"
//   },
//   function(token, tokenSecret, profile, done) {
//   	console.log(token);
//   	console.log(tokenSecret);
//   	console.log(profile);
//     // User.findOrCreate(..., function(err, user) {
//     //   if (err) { return done(err); }
//     //   done(null, user);
//     // });
//   }
// ));

// function consumer() {
//   return new oauth.OAuth(
//     "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
//     _twitterConsumerKey, _twitterConsumerSecret, "1.0A", , "HMAC-SHA1");   
// }