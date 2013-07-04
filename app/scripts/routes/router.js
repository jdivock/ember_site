App.Router.map(function() {
	this.resource("multipost", function() {

	});
	this.resource("blag", function() {
		this.route("new")
	});
});

App.MultipostIndexRoute = Ember.Route.extend({
	model: function() {
		return App.Post.createRecord();
	}
});