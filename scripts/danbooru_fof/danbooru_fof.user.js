// ==UserScript==
// @name         Danbooru FOF
// @namespace    https://github.com/reiyasona/danbooru.user.js
// @author       reiyasona
// @description  User script that slightly fades out your favourites
// @include      http*://*.donmai.us/posts*
// @include      http*://*.donmai.us/explore*
// @include      http*://*.donmai.us/
// @version      2021-01-07T03:16:00Z
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
		
		var postIdsCount = postIds.length;
		console.log("postIdsCount:", postIdsCount);
		
		for (var i = 0, len = postIdsCount; i < len; i += 20) {
			$.getJSON(`/favorites.json?search[post_id]=${postIds.slice(i, i + 20).join(",")}&search[user_id]=${userId}`).done(
				function (favedPostsJson) {
					if (favedPostsJson.length > 0) { console.log("favedPostsJson:", favedPostsJson); }
					
					favedPostIds = getValues(favedPostsJson, "post_id");
					if (favedPostIds.length > 0) { console.log("favedPostIds:", favedPostIds); }
					
					fadePosts(favedPostIds);
				}
			);
		}
	}
} else {
	console.log("The user ID is null! User not logged in?");
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
	var values = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == "object") {
			values = values.concat(getValues(obj[i], key));
		} else if (i == key) {
			values.push(obj[i]);
		}
	}
	return values;
}
