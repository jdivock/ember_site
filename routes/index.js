var Evernote = require('evernote').Evernote,
	OAuth = require('oauth').OAuth,
	querystring = require('querystring'),
	async = require('async'),
	Tumblr = require('tumblrwks');

exports.checkSessions = function(req, res) {
	var sessionCheck = new Object();

	sessionCheck.tumblr = {
		active: req.session.tumblr_oauth_access_token ? true : false
	};

	sessionCheck.evernote = {
		active: sessionCheck.evernote = req.session.evernote_oauth_access_token ? true : false
	};

	sessionCheck.mybb = req.session.mybb_oauth_accesss_token ? true : false;

	async.parallel([
		function(cb) {
			if (sessionCheck.evernote.active) {
				var client = new Evernote.Client({
					token: req.session.evernote_oauth_access_token,
					sandbox: true
				});
				var note_store = client.getNoteStore();
				note_store.listNotebooks(req.session.evernote_oauth_access_token, function(notebooks) {
					console.log("NOTEBOOKS");
					console.log(notebooks);

					sessionCheck.evernote.notebooks = notebooks;
					cb();
				});
			} else {
				cb();
			}
		},
		function(cb) {
			if (sessionCheck.tumblr.active) {
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

					sessionCheck.tumblr.blogs = feed.response.user.blogs;
					cb();

				})
			} else {
				cb();
			}

		}
	], function(err, results) {

		res.send(JSON.stringify(sessionCheck));
	});
};

exports.evernote_login = function(req, res) {
	var evernoteClient = new Evernote.Client({
		consumerKey: process.env.EVERNOTE_CONSUME_KEY,
		consumerSecret: process.env.EVERNOTE_SECRET_KEY,
		sandbox: true
	});

	evernoteClient.getRequestToken('http://' + req.headers.host + '/multipost/evernote_cb', function(error, oauthToken, oauthTokenSecret, results) {
		req.session.evernote_oauth_access_token = oauthToken;
		req.session.evernote_oauth_access_token_secret = oauthTokenSecret;

		res.redirect(evernoteClient.getAuthorizeUrl(oauthToken));
	});
};

exports.evernote_cb = function(req, res) {
	var evernoteClient = new Evernote.Client({
		consumerKey: process.env.EVERNOTE_CONSUME_KEY,
		consumerSecret: process.env.EVERNOTE_SECRET_KEY,
		sandbox: true
	});

	evernoteClient.getAccessToken(req.session.evernote_oauth_access_token, req.session.evernote_oauth_access_token_secret, req.param('oauth_verifier'), function(error, oauthAccessToken, oauthAccessTokenSecret, results) {

		req.session.evernote_oauth_access_token = oauthAccessToken;
		req.session.evernote_oauth_access_token_secret = oauthAccessTokenSecret;
		req.session.edamShard = results.edam_shard;
		req.session.edamUserId = results.edam_userId;
		req.session.edamExpires = results.edam_expires;
		req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
		req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;

		res.redirect('/#/multipost');
	});
};

exports.tumblr_login = function(req, res) {

	var oa = new OAuth("http://www.tumblr.com/oauth/request_token",
		"http://www.tumblr.com/oauth/access_token",
		process.env.TUMBLR_CONSUME_KEY,
		process.env.TUMBLR_SECRET_KEY,
		"1.0",
		"http://" + req.headers.host + "/multipost/tumblr_cb" + (req.param('action') && req.param('action') != "" ? "?action=" + querystring.escape(req.param('action')) : ""),
		"HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
			console.log('error');
			console.log(error);
		} else {
			// store the tokens in the session
			req.session.oa = oa;
			req.session.tumblr_oauth_token = oauth_token;
			req.session.tumblr_oauth_token_secret = oauth_token_secret;

			// redirect the user to authorize the token
			res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauth_token);
		}
	})
};

// Callback for the authorization page
exports.tumblr_cb = function(req, res) {

	// get the OAuth access token with the 'oauth_verifier' that we received

	var oa = new OAuth(req.session.oa._reqUrl,
		req.session.oa._accessUrl,
		req.session.oa._consumerKey,
		req.session.oa._consumerSecret,
		req.session.oa._version,
		req.session.oa._authorize_callback,
		req.session.oa._signatureMethod);

	oa.getOAuthAccessToken(
		req.session.tumblr_oauth_token,
		req.session.tumblr_oauth_token_secret,
		req.param('oauth_verifier'), function(error, tumblr_oauth_access_token, tumblr_oauth_access_token_secret, results2) {

		if (error) {
			console.log('error');
			console.log(error);
		} else {
			console.log("OA SUCCESS");
			// store the access token in the session
			req.session.tumblr_oauth_access_token = tumblr_oauth_access_token;
			req.session.tumblr_oauth_access_token_secret = tumblr_oauth_access_token_secret;

			res.redirect('/#/multipost');

		}

	});

};


exports.multiPostPosts = function(req, res) {
	// Don't need to enter a notebook, will go to default
	// req.evernote_notebook = req.session.notebooks[0];

	// POST TO TUMBLR
	tumblr = new Tumblr({
		consumerKey: process.env.TUMBLR_CONSUME_KEY,
		consumerSecret: process.env.TUMBLR_SECRET_KEY,
		accessToken: req.session.tumblr_oauth_access_token,
		accessSecret: req.session.tumblr_oauth_access_token_secret
	}, req.session.tumblr_blogs[0].name + ".tumblr.com");

	tumblr.post('/post', {
		type: 'text',
		title: req.body.post.title,
		body: req.body.post.post
	}, function(json) {
		console.log("TUMBLR POST COMPLETE: ");
		console.log(json);
	});

	// POST TO EVERNOTE
	var client = new Evernote.Client({
		token: req.session.evernote_oauth_access_token,
		sandbox: true
	});
	var note_store = client.getNoteStore();

	var note = new Evernote.Note({
		title: req.body.post.title
	});

	note.content = '<?xml version="1.0" encoding="UTF-8"?>';
	note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
	note.content += '<en-note>' + req.body.post.post;
	note.content += '</en-note>';

	note_store.createNote(req.session.evernote_oauth_access_token, note, function(note) {
		console.log("NOTE CREATED");
		console.log(note);
	});


	res.send({
		"status": "ok"
	})
};

exports.getTumblrUserInfo = function(req, res) {


};

function require_tumblr_login(req, res, next) {
	if (!req.session.tumblr_oauth_access_token) {
		res.redirect("/multipost/tumblr_login?action=" + querystring.escape(req.originalUrl));
		return;
	}
	next();
};