// ==UserScript==
// @name         Danbooru FOF
// @namespace    https://github.com/reiyasona/danbooru.user.js
// @author       reiyasona
// @description  User script that slightly fades out your favourites
// @include      http*://*.donmai.us/posts*
// @include      http*://*.donmai.us/explore*
// @include      http*://*.donmai.us/
// @version      2021-01-06T06:08:36Z
// @grant        none
// @run-at       document-idle
// ==/UserScript==

var userId = $("body").attr("data-current-user-id");
console.log("userId:", userId);

if (userId !== "null") {
	
	var userName = $("body").attr("data-current-user-name").toLowerCase();
	console.log("userName:", userName);
	
	if (document.title.toLowerCase().indexOf("fav:" + userName) === -1) {
		
		var postIds = $(".post-preview").map((i, post) => $(post).data("id")).toArray();
		console.log("postIds:", postIds);
		
		var favedPostIds = [];
		
		var useHtml = false;
		console.log("useHtml:", useHtml);
		
		switch (useHtml) {
			case true:
			console.log("Using HTML mode! [DEPRECATED: https://github.com/danbooru/danbooru/issues/4652#issuecomment-754993802]");
			collectFavedPostsHtml();
			fadePosts();
			break;
			default:
			console.log("Using JSON mode!");
			collectFavedPostsJson().then(function(){ fadePosts(); });
		}
	}
} else {
	console.log("The User ID is null! User not logged in?");
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
	return $.getJSON(`/favorites.json?search[post_id]=${postIds.join(",")}&search[user_id]=${userId}`).done(
		function (favedPostsJson) {
			console.log("favedPostsJson:", favedPostsJson);
			
			favedPostIds = getValues(favedPostsJson, "post_id");
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
