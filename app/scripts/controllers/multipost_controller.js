App.MultipostIndexController = Ember.ArrayController.extend({
	submitMultiPost: function() {
		console.log(this.get('session.evernoteNotebook'));
		console.log(this.get('session.tumblrBlog'));
		this.get('session').save();
	},
	blogVisible: Ember.computed.and('session.tumblrActive', 'session.tumblrSession'),
	notebookVisible: Ember.computed.and('session.evernoteActive', 'session.evernoteSession'),
	disabledTumblr: Ember.computed.not('session.tumblrSession'),
	disabledEvernote: Ember.computed.not('session.evernoteSession'),
	disabledSBWC: Ember.computed.not('session.sbwcSession')
})