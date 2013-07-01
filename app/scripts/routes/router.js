App.Router.map(function() {
	this.route("blag", {
		connectOutlets: function(router) {
			console.log(router);
			router.set('applicationController.selected', 'blag');
		}
	});
	this.route("multipost");
});