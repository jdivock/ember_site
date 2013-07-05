App.MultipostIndexController = Ember.ArrayController.extend({
	submitMultiPost: function() {
		console.log(this.get('session.evernoteActive'));
		//this.get('model').save();
	},
	tumblrVisible: Ember.computed.bool('false'),
	disabledTumblr: Ember.computed.not('session.tumblrSession'),
	disabledEvernote: Ember.computed.not('session.evernoteSession'),
	disabledSBWC: Ember.computed.not('session.sbwcSession')
})