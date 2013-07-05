App.Post = DS.Model.extend({
	title: DS.attr('string'),
	post: DS.attr('string'),
	evernote: {
		selected: DS.attr('boolean'),
		notebook: DS.attr('string')
	},
	tumblr: {
		selected: DS.attr('boolean'),
		blog: DS.attr('string')
	},
	sbwc: {
		selected: DS.attr('boolean'),
		threadId: DS.attr('string')
	},

	evernoteSession: DS.attr('boolean'),
	tumblrSession: DS.attr('boolean'),
	sbwcSession: DS.attr('boolean')

});

App.Notebook = DS.Model.extend({
	name: DS.attr('string')
});

App.Blog = DS.Model.extend({
	name: DS.attr('string'),
	title: DS.attr('string'),
	description: DS.attr('string'),
	url: DS.attr('string')
});