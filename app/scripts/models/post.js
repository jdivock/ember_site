App.Post = DS.Model.extend({
	title: DS.attr('string'),
	post: DS.attr('string'),

	evernoteActive: DS.attr('boolean'),
	evernoteNotebook: DS.attr('string'),
	evernoteSession: DS.attr('boolean'),

	tumblrActive: DS.attr('boolean'),
	tumblrBlog: DS.attr('string'),
	tumblrSession: DS.attr('boolean'),
	
	sbwcActive: DS.attr('boolean'),
	sbwcThreadId: DS.attr('string'),
	sbwcSession: DS.attr('boolean'),

	saved: DS.attr('boolean'),

	didUpdate: function() {
		$.pnotify({
			title: 'Success!',
			text: 'Post Successfully Created.',
			type: 'success'
		});
		this.set('title', '');
		this.set('post', '');
	}

});

App.SBWC = DS.Model.extend({
	userName: DS.attr('string'),
	password: DS.attr('string')
})

App.Notebook = DS.Model.extend({
	name: DS.attr('string'),
	guid: DS.attr('string')
});

App.Blog = DS.Model.extend({
	name: DS.attr('string'),
	title: DS.attr('string'),
	description: DS.attr('string'),
	url: DS.attr('string')
});