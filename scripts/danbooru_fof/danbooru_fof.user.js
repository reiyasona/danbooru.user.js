// ==UserScript==
// @name         Danbooru FOF
// @namespace    https://github.com/reiyasona/danbooru.user.js
// @author       reiyasona
// @description  User script that slightly fades out your favourites
// @include      http*://*.donmai.us/posts*
// @include      http*://*.donmai.us/explore*
// @include      http*://*.donmai.us/
// @version      2018-05-09T02:25:26Z
// @grant        none
// @run-at       document-idle
// ==/UserScript==

var useJSON = false;

var userName = $("meta[name='current-user-name']").attr("content");
console.log("userName:", userName);

if (document.title.indexOf("fav:" + userName) === -1) {

	var userId = $("meta[name='current-user-id']").attr("content");
	console.log("userId:", userId);

	var postIds = $(".post-preview").map((i, post) => $(post).data("id")).toArray();
	console.log("postIds:", postIds);

	var favedPostIds = [];

	switch (useJSON) {
		case true:
		collectFavedPostsJson().then(function(){ fadePosts(); });
		break;
		default:
		collectFavedPostsHtml();
		fadePosts();
	}
}

function collectFavedPostsHtml() {
	var postFavStatuses = $(".post-preview").map((i, postFavStatuses) => $(postFavStatuses).data("is-favorited")).toArray();
	console.log("postFavStatuses:", postFavStatuses);

	for (var i = 0, len = postIds.length; i < len; i++) {
		if (postFavStatuses[i]) {
			favedPostIds.push(postIds[i]);
		}
	}
	console.log("favedPostIds:", favedPostIds);
}

function collectFavedPostsJson() {
	return $.getJSON(`/posts.json?tags=status:any+id:${postIds.join(",")}`).done(
		function (postsJson) {
			console.log("postsJson:", postsJson);

			var favedPostsJson = getObjects(postsJson, "fav_string", "fav:" + userId);
			console.log("favedPostsJson:", favedPostsJson);

			favedPostIds = getValues(favedPostsJson, "id");
			console.log("favedPostIds:", favedPostIds);
		}
	);
}

function fadePosts() {
	var i, len;
	for (var i = 0, len = favedPostIds.length; i < len; i++) {
		$("#post_" + favedPostIds[i]).fadeTo("slow", 0.15);
		$("#post_" + favedPostIds[i]).hover(function() {
			$(this).fadeTo(0, 1);
			}, function() {
			$(this).fadeTo(0, 0.15);
		});
	}
}

function getObjects(obj, key, val) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == "object") {
			objects = objects.concat(getObjects(obj[i], key, val));
		} else
			if (i == key && obj[i].indexOf(val) !== -1 || i == key && val == "") {
				objects.push(obj);
			} else if (obj[i] == val && key == ""){
				if (objects.lastIndexOf(obj) == -1){
					objects.push(obj);
				}
			}
	}
	return objects;
}

function getValues(obj, key) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == "object") {
			objects = objects.concat(getValues(obj[i], key));
		} else if (i == key) {
			objects.push(obj[i]);
		}
	}
	return objects;
}
