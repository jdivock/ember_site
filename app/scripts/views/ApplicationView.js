/*App.ApplicationView = Em.View.extend({
	templateName: 'application',
	NavbarView: Em.View.extend({
		init: function() {
			this._super();
			this.set('controller', this.get('parentView.controller').controllerFor('navbar'))
		},
		selectedRouteName: 'home',
		gotoRoute: function(e) {
			this.set('selectedRouteName', e.routeName);
			this.get('controller.target.router').transitionTo(e.routePath);
		},
		templateName: 'navbar',
		MenuItemView: Em.View.extend({
			templateName: 'menu-item',
			tagName: 'li',
			classNameBindings: 'IsActive:active'.w(),
			IsActive: function() {
				return this.get('item.routeName') === this.get('parentView.selectedRouteName');
			}.property('item', 'parentView.selectedRouteName')
		})
	})
});

App.NavbarController = Em.ArrayController.extend({
	content: [],
	init: function() {
		var home = App.NavItem.create({
			displayText: 'Home',
			routePath: 'index.home',
			routeName: 'home'
		});

		var bio = App.NavItem.create({
			displayText: 'Bio',
			routePath: 'index.bio',
			routeName: 'bio'
		});

		this.set('content', [home, bio]);
	}
});*/