App.MultipostIndexController = Ember.ArrayController.extend({
	submitMultiPost: function() {
		console.log(this.get('session.evernoteNotebook'));
		console.log(this.get('session.tumblrBlog'));
		this.get('session').save();
	},
	tumblrVisible: Ember.computed.bool('false'),
	disabledTumblr: Ember.computed.not('session.tumblrSession'),
	disabledEvernote: Ember.computed.not('session.evernoteSession'),
	disabledSBWC: Ember.computed.not('session.sbwcSession')
})