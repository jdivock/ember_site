var express = require('express'),
	OAuth = require('oauth').OAuth,
	Tumblr = require('tumblrwks'),
	Cookies = require('cookies'),
	querystring = require('querystring');

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
}



// Setup the Express.js server
var app = express.createServer();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
	secret: "skjghskdjfhbqigohqdiouk"
}));
app.use(express.methodOverride());
app.use(allowCrossDomain);

app.use(express.static(__dirname + "/dist"));

// Home Page
app.get('/checkSessions', function(request, response) {
	var sessionCheck = new Object();

	if (response.tumblrToken) {
		request.session.tumblr_oauth_access_token = response.tumblrToken;
		request.session.tumblr_oauth_access_token_secret = response.tumblrTokenSecret;
	}

	sessionCheck.tumblr = request.session.tumblr_oauth_access_token ? true : false;
	sessionCheck.evernote = request.session.evernote_oauth_access_token ? true : false;
	sessionCheck.mybb = request.session.mybb_oauth_accesss_token ? true : false;

	console.log(request.session);

	sessionCheck.tumblr_blogs = request.session.tumblr_blogs;

	response.send(JSON.stringify(sessionCheck));
});


app.get('/tumblr_login', function(request, response) {

	var oa = new OAuth("http://www.tumblr.com/oauth/request_token",
		"http://www.tumblr.com/oauth/access_token",
		process.env.MULTIPOST_CONSUME_KEY,
		process.env.MULTIPOST_SECRET_KEY,
		"1.0",
		"http://localhost:3000/tumblr_cb" + (request.param('action') && request.param('action') != "" ? "?action=" + querystring.escape(request.param('action')) : ""),
		"HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
			console.log('error');
			console.log(error);
		} else {
			// store the tokens in the session
			request.session.oa = oa;
			request.session.oauth_token = oauth_token;
			request.session.oauth_token_secret = oauth_token_secret;

			// redirect the user to authorize the token
			response.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauth_token);
		}
	})
})

// Callback for the authorization page
app.get('/tumblr_cb', function(request, response) {

	// get the OAuth access token with the 'oauth_verifier' that we received

	var oa = new OAuth(request.session.oa._requestUrl,
		request.session.oa._accessUrl,
		request.session.oa._consumerKey,
		request.session.oa._consumerSecret,
		request.session.oa._version,
		request.session.oa._authorize_callback,
		request.session.oa._signatureMethod);

	console.log(oa);

	oa.getOAuthAccessToken(
		request.session.oauth_token,
		request.session.oauth_token_secret,
		request.param('oauth_verifier'), function(error, tumblr_oauth_access_token, tumblr_oauth_access_token_secret, results2) {

		if (error) {
			console.log('error');
			console.log(error);
		} else {
			console.log("OA SUCCESS");
			// store the access token in the session
			request.session.tumblr_oauth_access_token = tumblr_oauth_access_token;
			request.session.tumblr_oauth_access_token_secret = tumblr_oauth_access_token_secret;

			response.redirect((request.param('action') && request.param('action') != "") ? request.param('action') : "/getTumblrUserInfo");

		}

	});

});


app.post('/postTumblr', require_tumblr_login, function(request, response) {
	tumblr = new Tumblr({
		consumerKey: request.session.oa._consumerKey,
		consumerSecret: request.session.oa._consumerSecret,
		accessToken: request.session.tumblr_oauth_access_token,
		accessSecret: request.session.tumblr_oauth_access_token_secret
	}, request.tumblr_blog);

	tumblr.post('/post', {
		type: 'text',
		title: request.body.title,
		body: requesst.body.body
	}, function(json) {
		console.log(json);
	});

	response.send({
		"status": "ok"
	})
})

app.get('/getTumblrUserInfo', require_tumblr_login, function(request, response) {

	var oa = new OAuth(request.session.oa._requestUrl,
		request.session.oa._accessUrl,
		request.session.oa._consumerKey,
		request.session.oa._consumerSecret,
		request.session.oa._version,
		request.session.oa._authorize_callback,
		request.session.oa._signatureMethod);


	console.log("GETTING TUMBLR INFO");

	oa.getProtectedResource(
		"http://api.tumblr.com/v2/user/info	",
		"GET",
		request.session.tumblr_oauth_access_token,
		request.session.tumblr_oauth_access_token_secret, function(error, data, res) {
		console.log("DATA: " + data);
		var feed = JSON.parse(data);

		request.session.tumblr_blogs = feed.response.user.blogs;
		console.log(request.session.tumblr_blogs);


		//response.write(data);
		//response.write(JSON.stringify(data));
		//response.end();
		response.redirect("/#/multipost");

	})
});

function require_tumblr_login(request, response, next) {
	if (!request.session.tumblr_oauth_access_token) {
		response.redirect("/tumblr_login?action=" + querystring.escape(request.originalUrl));
		return;
	}
	next();
};

app.get('/getTumblrInfo', require_tumblr_login, function(request, response) {

	var oa = new OAuth(request.session.oa._requestUrl,
		request.session.oa._accessUrl,
		request.session.oa._consumerKey,
		request.session.oa._consumerSecret,
		request.session.oa._version,
		request.session.oa._authorize_callback,
		request.session.oa._signatureMethod);

	console.log("GETTING TUMBLR INFO");

	oa.getProtectedResource(
		"http://api.tumblr.com/v2/user/info	",
		"GET",
		request.session.tumblr_oauth_access_token,
		request.session.tumblr_oauth_access_token_secret, function(error, data, res) {
		console.log("DATA: " + data);
		var feed = JSON.parse(data);
		response.write(data);

		response.end();
	})
});



var port = process.env.PORT || 3000;
console.log("listening on http://localhost:" + port);
app.listen(port);