// ==UserScript==
// @name         Danbooru FOF
// @namespace    https://github.com/reiyasona/danbooru.user.js
// @author       reiyasona
// @description  User script that slightly fades out your favourites
// @include      http*://*.donmai.us/posts*
// @include      http*://*.donmai.us/explore*
// @include      http*://*.donmai.us/
// @version      2017-05-27T21:40:55Z
// @grant        none
// @run-at       document-idle
// ==/UserScript==

var logging = true;

var userName = $("meta[name='current-user-name']").attr("content");
if (logging) {console.log("userName:", userName)};

var userId = $("meta[name='current-user-id']").attr("content");
if (logging) {console.log("userId:", userId)};

if (document.title.indexOf("fav:" + userName) === -1) {

	var postIds = $(".post-preview").map((i, post) => $(post).data("id")).toArray();
	if (logging) {console.log("postIds:", postIds)};

	$.getJSON(`/posts.json?tags=id:${postIds.join(",")}`).done(
			function (json) {
				if (logging) {console.log("json:", json)};
				var favedPosts = getObjects(json, "fav_string", "fav:" + userId);
				if (logging) {console.log("favedPosts:", favedPosts)};
				var favedIds = getValues(favedPosts, "id");
				if (logging) {console.log("favedIds:", favedIds)};
				fadePosts(favedIds);
			}
	);
};

function fadePosts(favedIds) {
	var i, len;
	for (var i = 0, len = favedIds.length; i < len; i++) {
		$("#post_" + favedIds[i]).fadeTo("slow", 0.15);
		$("document").ready(function() {
			$("#post_" + favedIds[i]).hover(function() {
				$(this).fadeTo(0, 1);
				}, function() {
				$(this).fadeTo(0, 0.15);
			});
		});
		if (logging) {console.log("favedIds[" + i + "]:", favedIds[i])};
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
