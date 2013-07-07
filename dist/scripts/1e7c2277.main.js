!function(){window.App=Ember.Application.create()}(),function(){App.Router.map(function(){this.resource("multipost",function(){}),this.resource("blag",function(){this.route("new")})}),App.MultipostIndexRoute=Ember.Route.extend({model:function(){return App.Post.find("singleton")},setupController:function(a,b){a.set("session",b),a.set("notebooks",App.Notebook.find()),a.set("blogs",App.Blog.find())}})}(),function(){App.MultipostIndexController=Ember.ArrayController.extend({titleWarn:!1,postWarn:!1,postSuccess:!1,submitMultiPost:function(){""===$.trim(this.get("session.title"))&&this.set("titleWarn",!0),""===$.trim(this.get("session.post"))&&this.set("postWarn",!0),""!==$.trim(this.get("session.post"))&&""!==$.trim(this.get("session.title"))&&this.get("session").save()},blogVisible:Ember.computed.and("session.tumblrActive","session.tumblrSession"),notebookVisible:Ember.computed.and("session.evernoteActive","session.evernoteSession"),disabledTumblr:Ember.computed.not("session.tumblrSession"),disabledEvernote:Ember.computed.not("session.evernoteSession"),disabledSBWC:Ember.computed.not("session.sbwcSession")})}(),function(){App.Post=DS.Model.extend({title:DS.attr("string"),post:DS.attr("string"),evernoteActive:DS.attr("boolean"),evernoteNotebook:DS.attr("string"),evernoteSession:DS.attr("boolean"),tumblrActive:DS.attr("boolean"),tumblrBlog:DS.attr("string"),tumblrSession:DS.attr("boolean"),sbwcActive:DS.attr("boolean"),sbwcThreadId:DS.attr("string"),sbwcSession:DS.attr("boolean"),saved:DS.attr("boolean"),didUpdate:function(){$.pnotify({title:"Success!",text:"Post Successfully Created.",type:"success"}),this.set("title",""),this.set("post","")}}),App.SBWC=DS.Model.extend({userName:DS.attr("string"),password:DS.attr("string")}),App.Notebook=DS.Model.extend({name:DS.attr("string"),guid:DS.attr("string")}),App.Blog=DS.Model.extend({name:DS.attr("string"),title:DS.attr("string"),description:DS.attr("string"),url:DS.attr("string")})}(),function(){App.Store=DS.Store.extend({}),App.Store.registerAdapter("App.Post",DS.RESTAdapter.extend({namespace:"multipost"})),App.Store.registerAdapter("App.SBWC",DS.RESTAdapter.extend({namespace:"multipost"})),App.Store.registerAdapter("App.Notebook",DS.RESTAdapter.extend({namespace:"multipost",primaryKey:"guid"})),App.Store.registerAdapter("App.Blog",DS.RESTAdapter.extend({namespace:"multipost",primaryKey:"name"}))}();