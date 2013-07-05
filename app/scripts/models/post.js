App.Post = DS.Model.extend({
	title: DS.attr('string'),
	post: DS.attr('string'),

	evernoteActive: DS.attr('string'),
	evernoteNotebook: DS.attr('string'),

	tumblrActive: DS.attr('boolean'),
	tumblrBlog: DS.attr('string'),

	sbwcActive: DS.attr('boolean'),
	sbwcTheadId: DS.attr('string'),

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