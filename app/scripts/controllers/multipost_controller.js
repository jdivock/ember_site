App.MultipostIndexController = Ember.ArrayController.extend({
	submitMultiPost: function() {
		//console.log(this.get('model').get(0));
		this.get('model').save();
	},
	disabledTumblr: Ember.computed.not('session.tumblrSession')
})