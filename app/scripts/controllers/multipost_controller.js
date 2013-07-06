App.MultipostIndexController = Ember.ArrayController.extend({
	titleWarn: false,
	postWarn: false,
	postSuccess: false,
	submitMultiPost: function() {

		if ($.trim(this.get('session.title')) === '') {
			this.set('titleWarn', true);
		}
		if ($.trim(this.get('session.post')) === '') {
			this.set('postWarn', true);
		}
		if ($.trim(this.get('session.post')) !== '' && $.trim(this.get('session.title')) !== '') {
			this.get('session').save();
		}

	},
	blogVisible: Ember.computed.and('session.tumblrActive', 'session.tumblrSession'),
	notebookVisible: Ember.computed.and('session.evernoteActive', 'session.evernoteSession'),
	disabledTumblr: Ember.computed.not('session.tumblrSession'),
	disabledEvernote: Ember.computed.not('session.evernoteSession'),
	disabledSBWC: Ember.computed.not('session.sbwcSession')
})