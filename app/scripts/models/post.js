App.Post = DS.Model.extend({

	title: DS.attr('string'),
	post: DS.attr('string'),
	evernote: {
		active: DS.attr('boolean'),
		notebook: DS.attr('string')
	},
	tumblr: {
		active: DS.attr('boolean'),
		blog: DS.attr('string')
	},
	sbwc: {
		active: DS.attr('boolean'),
		threadId: DS.attr('string')
	}
});