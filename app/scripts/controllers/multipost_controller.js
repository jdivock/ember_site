App.MultipostIndexController = Ember.ObjectController.extend({
	submitMultiPost: function() {
		console.log(this.get('model.evernote'));

		this.get('model').save();

	}
})