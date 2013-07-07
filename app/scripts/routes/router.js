App.Router.map(function() {
	this.resource("multipost", function() {

	});
	this.resource("blag", function() {
		this.route("new")
	});
});

App.MultipostIndexRoute = Ember.Route.extend({
	model: function() {

		return App.Post.find('singleton');
		//return App.Notebook.find();
	},
	setupController: function(controller, model) {
		controller.set('session', model);

		controller.set('notebooks', App.Notebook.find());
		controller.set('blogs', App.Blog.find());

	}
});