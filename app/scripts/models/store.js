App.Store = DS.Store.extend({

});

App.Store.registerAdapter('App.Post', DS.RESTAdapter.extend({
	url: "http://localhost:3000",
	namespace: "multipost"
}));