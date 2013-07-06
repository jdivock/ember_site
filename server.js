var express = require('express'),
	Cookies = require('cookies'),
	routes = require('./routes');

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

if (process.argv[2] === 'dist') {
	app.use(express.static(__dirname + "/dist"));
} else {
	app.use(express.static(__dirname + "/app"));
	app.use(express.static(__dirname + "/.tmp"));
}

// Routes
app.get('/multipost/evernote_login', routes.evernote_login);
app.get('/multipost/evernote_cb', routes.evernote_cb);
app.get('/multipost/tumblr_login', routes.tumblr_login);
app.get('/multipost/tumblr_cb', routes.tumblr_cb);
app.get('/multipost/getTumblrUserInfo', routes.getTumblrUserInfo);

app.get('/multipost/posts/:id', routes.checkSessions);
app.put('/multipost/posts/:id', routes.multiPostPosts);

app.get('/multipost/blogs', routes.require_tumblr_login, routes.getBlogs);

app.get('/multipost/notebooks', routes.require_evernote_login, routes.getNotebooks);

app.post('/multipost/sbwc', routes.sbwcLogin);
app.get('/multipost/sbwcPost', routes.sbwcPost);
app.get('/multipost/sbwc', routes.sbwcLogin);

var port = process.env.PORT || 3000;
console.log("listening on http://localhost:" + port);
app.listen(port);