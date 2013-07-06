App.Store = DS.Store.extend({

});

App.Store.registerAdapter('App.Post', DS.RESTAdapter.extend({
	namespace: "multipost"
}));

App.Store.registerAdapter('App.SBWC', DS.RESTAdapter.extend({
	namespace: "multipost"
}));

App.Store.registerAdapter('App.Notebook', DS.RESTAdapter.extend({
	namespace: "multipost",
	primaryKey: "guid"
}));

App.Store.registerAdapter('App.Blog', DS.RESTAdapter.extend({
	namespace: "multipost",
	primaryKey: "name"
}));