App.Router.map(function() {
	this.route("blag");
	this.route("multipost");
});


/*
App.IndexMultiPostRoute = Em.Route.extend({
	enter: function() {
		console.log('multiPost route');
		$(document).attr("title", "MultiPost");
	},
	renderTemplate: function() {
		this.render('multipost');
	}
});

App.IndexBlagRoute = Em.Route.extend({
	enter: function() {
		console.log('blag route');
		$(document).attr("title", "Bio");
	},
	renderTemplate: function() {
		this.render('bio');
	}
});

App.IndexRoute = Em.Route.extend({
	enter: function() {
		console.log('index route');
	},
	redirect: function() {
		this.transitionTo('index.home');
	}
});*/