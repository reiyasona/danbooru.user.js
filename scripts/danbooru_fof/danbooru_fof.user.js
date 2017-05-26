// ==UserScript==
// @name         Danbooru FOF
// @namespace    https://github.com/reiyasona/danbooru.user.js
// @author       reiyasona
// @description  User script that slightly fades out your favourites
// @include      http*://*.donmai.us/posts*
// @include      http*://*.donmai.us/explore*
// @include      http*://*.donmai.us/
// @version      2017-05-26T15:59:17Z
// @grant        none
// @run-at       document-idle
// ==/UserScript==

var userId = $('meta[name="current-user-id"]').attr("content");

var postIds = $(".post-preview").map((i, post) => $(post).data("id")).toArray();

$.getJSON(`/posts.json?tags=id:${postIds.join(",")}`).done(
		function (json) {
			var favedPosts = getObjectsIndexOf(json, 'fav_string', 'fav:' + userId);
			var favedIds = getValues(favedPosts, 'id');
			markPosts(favedIds);
		}

);

function markPosts(favedIds) {
	var i, len;
	for (var i = 0, len = favedIds.length; i < len; i++) {
		$('#post_' + favedIds[i]).fadeTo("slow", 0.15);
		$('document').ready(function() {
			$('#post_' + favedIds[i]).hover(function() {
				$(this).fadeTo("slow", 1);
				}, function() {
				$(this).fadeTo("slow", 0.15);
			});
		});
	}
}

function getObjectsIndexOf(obj, key, val) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getObjectsIndexOf(obj[i], key, val));
		} else
			if (i == key && obj[i].indexOf(val) !== -1 || i == key && val == '') {
				objects.push(obj);
			} else if (obj[i] == val && key == ''){
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
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getValues(obj[i], key));
		} else if (i == key) {
			objects.push(obj[i]);
		}
	}
	return objects;
}
