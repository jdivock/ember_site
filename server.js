var express = require('express'),
	OAuth = require('oauth').OAuth,
	Tumblr = require('tumblrwks'),
	Cookies = require('cookies'),
	Evernote = require('evernote').Evernote,
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
	secret: "asdklfjasdf"
}));
app.use(express.methodOverride());
app.use(allowCrossDomain);

app.use(express.static(__dirname + "/dist"));


var evernoteClient = new Evernote.Client({
	consumerKey: process.env.EVERNOTE_CONSUME_KEY,
	consumerSecret: process.env.EVERNOTE_SECRET_KEY,
	sandbox: true
});


// Home Page
app.get('/checkSessions', function(req, res) {
	var sessionCheck = new Object();

	if (res.tumblrToken) {
		req.session.tumblr_oauth_access_token = res.tumblrToken;
		req.session.tumblr_oauth_access_token_secret = res.tumblrTokenSecret;
	}

	sessionCheck.tumblr = {
		active: req.session.tumblr_oauth_access_token ? true : false,
		blogs: req.session.tumblr_blogs
	};

	sessionCheck.evernote = {
		active: sessionCheck.evernote = req.session.oauthAccessToken ? true : false,
		notebooks: req.session.notebooks
	};

	sessionCheck.mybb = req.session.mybb_oauth_accesss_token ? true : false;

	res.send(JSON.stringify(sessionCheck));
});

app.get('/evernote_login', function(req, res) {
	evernoteClient.getRequestToken('http://localhost:3000/evernote_cb', function(error, oauthToken, oauthTokenSecret, results) {
		req.session.evernote_oauth_access_token = oauthToken;
		req.session.evernote_oauth_access_token_secret = oauthTokenSecret;

		res.redirect(evernoteClient.getAuthorizeUrl(oauthToken));
	});
});

app.get('/evernote_cb', function(req, res) {
	console.log("EVERNOTE CALLBACK");
	console.log(req.query);

	req.session.evernote_oauth_token = req.query.oauth_token;
	req.session.evernote_oauth_verifier = req.query.oauth_verifier;

	evernoteClient.getAccessToken(req.session.evernote_oauth_access_token, req.session.evernote_oauth_access_token_secret, req.param('oauth_verifier'), function(error, oauthAccessToken, oauthAccessTokenSecret, results) {

		req.session.oauthAccessToken = oauthAccessToken;
		req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
		req.session.edamShard = results.edam_shard;
		req.session.edamUserId = results.edam_userId;
		req.session.edamExpires = results.edam_expires;
		req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
		req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;

		var client = new Evernote.Client({
			token: req.session.oauthAccessToken,
			sandbox: true
		});
		req.session.note_store = client.getNoteStore();
		req.session.note_store.listNotebooks(req.session.oauthAccessToken, function(notebooks) {
			req.session.notebooks = notebooks;
			console.log("NOTEBOOKS");
			console.log(notebooks);

			res.redirect('/#/multipost');

		});


	});
});

app.get('/tumblr_login', function(req, res) {

	var oa = new OAuth("http://www.tumblr.com/oauth/req_token",
		"http://www.tumblr.com/oauth/access_token",
		process.env.TUMBLR_CONSUME_KEY,
		process.env.TUMBLR_SECRET_KEY,
		"1.0",
		"http://localhost:3000/tumblr_cb" + (req.param('action') && req.param('action') != "" ? "?action=" + querystring.escape(req.param('action')) : ""),
		"HMAC-SHA1");

	oa.getOAuthreqToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
			console.log('error');
			console.log(error);
		} else {
			// store the tokens in the session
			req.session.oa = oa;
			req.session.oauth_token = oauth_token;
			req.session.oauth_token_secret = oauth_token_secret;



			// redirect the user to authorize the token
			res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauth_token);
		}
	})
})

// Callback for the authorization page
app.get('/tumblr_cb', function(req, res) {

	// get the OAuth access token with the 'oauth_verifier' that we received

	var oa = new OAuth(req.session.oa._reqUrl,
		req.session.oa._accessUrl,
		req.session.oa._consumerKey,
		req.session.oa._consumerSecret,
		req.session.oa._version,
		req.session.oa._authorize_callback,
		req.session.oa._signatureMethod);

	console.log(oa);

	oa.getOAuthAccessToken(
		req.session.oauth_token,
		req.session.oauth_token_secret,
		req.param('oauth_verifier'), function(error, tumblr_oauth_access_token, tumblr_oauth_access_token_secret, results2) {

		if (error) {
			console.log('error');
			console.log(error);
		} else {
			console.log("OA SUCCESS");
			// store the access token in the session
			req.session.tumblr_oauth_access_token = tumblr_oauth_access_token;
			req.session.tumblr_oauth_access_token_secret = tumblr_oauth_access_token_secret;

			res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/getTumblrUserInfo");

		}

	});

});


app.post('/postMulti', function(req, res) {

	//TEST HARNESS
	req.tumblr_blog = req.session.tumblr_blogs[0].name;

	req.evernote_notebook = req.session.notebooks[0];

	console.log("TUMB BLOG");
	console.log(req.tumblr_blog);

	// POST TO TUMBLR
	tumblr = new Tumblr({
		consumerKey: req.session.oa._consumerKey,
		consumerSecret: req.session.oa._consumerSecret,
		accessToken: req.session.tumblr_oauth_access_token,
		accessSecret: req.session.tumblr_oauth_access_token_secret
	}, req.tumblr_blog);

	tumblr.post('/post', {
		type: 'text',
		title: req.body.title,
		body: requesst.body.body
	}, function(json) {
		console.log(json);
	});

	// POST TO EVERNOTE
	var note = new Evernote.Note({
		title: req.body.title,
		content: requesst.body.body
	})

	req.session.note_store.createNote(req.session.oauthAccessToken, note, function(note) {
		console.log("NOTE CREATED");
		console.log(note);
	});


	res.send({
		"status": "ok"
	})
})

app.get('/getTumblrUserInfo', require_tumblr_login, function(req, res) {

	var oa = new OAuth(req.session.oa._reqUrl,
		req.session.oa._accessUrl,
		req.session.oa._consumerKey,
		req.session.oa._consumerSecret,
		req.session.oa._version,
		req.session.oa._authorize_callback,
		req.session.oa._signatureMethod);


	console.log("GETTING TUMBLR INFO");

	oa.getProtectedResource(
		"http://api.tumblr.com/v2/user/info	",
		"GET",
		req.session.tumblr_oauth_access_token,
		req.session.tumblr_oauth_access_token_secret, function(error, data, res) {
		console.log("DATA: " + data);
		var feed = JSON.parse(data);

		req.session.tumblr_blogs = feed.res.user.blogs;
		console.log(req.session.tumblr_blogs);


		//res.write(data);
		//res.write(JSON.stringify(data));
		//res.end();
		res.redirect("/#/multipost");

	})
});

function require_tumblr_login(req, res, next) {
	if (!req.session.tumblr_oauth_access_token) {
		res.redirect("/tumblr_login?action=" + querystring.escape(req.originalUrl));
		return;
	}
	next();
};

app.get('/getTumblrInfo', require_tumblr_login, function(req, res) {

	var oa = new OAuth(req.session.oa._reqUrl,
		req.session.oa._accessUrl,
		req.session.oa._consumerKey,
		req.session.oa._consumerSecret,
		req.session.oa._version,
		req.session.oa._authorize_callback,
		req.session.oa._signatureMethod);

	console.log("GETTING TUMBLR INFO");

	oa.getProtectedResource(
		"http://api.tumblr.com/v2/user/info	",
		"GET",
		req.session.tumblr_oauth_access_token,
		req.session.tumblr_oauth_access_token_secret, function(error, data, res) {
		console.log("DATA: " + data);
		var feed = JSON.parse(data);
		res.write(data);

		res.end();
	})
});



var port = process.env.PORT || 3000;
console.log("listening on http://localhost:" + port);
app.listen(port);