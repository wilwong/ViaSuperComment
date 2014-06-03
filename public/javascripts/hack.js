var app = {};
app.playerOptions = {
	width: 780,
	height: 440
};

app.showComment = function(id) {
	var comment = _.find(app.comments, function(el){ return el._id == id})
	var commentDom = $('.comment-thumbnail[data-comment-id="' + id + '"]')
	var niceTime = app.niceTime(comment.position)
	$('.thumb-indicator').css('visibility', 'visible').css('left', commentDom.css('left'))
	$('.comment-thumbnail').removeClass('current')
	commentDom.addClass('current')
	$('.comment-box-buffer img').attr('src', 'http://graph.facebook.com/' + comment.fbid + '/picture')
	$('.comment-box-buffer .name').text(comment.name)
	$('.comment-box-buffer .name').attr('href', 'http://facebook.com/' + comment.fbid)
	$('.comment-box-buffer .text').text(comment.text)
	$('.comment-box-buffer .position').text(niceTime)
	$('.comment-box-buffer').show()
	$('.comment-box').show()
	$('.comment-box').html($('.comment-box-buffer').html())
	$('.comment-box-buffer').hide()
}

app.niceTime = function(seconds) {
	return Math.round(seconds / 60) + ':' + parseInt((seconds % 60))
}

app.initCommentThumbnails = function(response) {
	if (!app.player.currentMetadata.duration)
		return
	$('.thumbnails-container .comment-thumbnail').remove()
	app.comments = response
	app.comments.forEach(function(comment){
		app.appendComment(comment)
		var offset = $('.thumbnails-container').width() * (comment.position / app.player.currentMetadata.duration)
		var thumb = $('<img class="comment-thumbnail">')
		thumb.attr('src', 'http://graph.facebook.com/' + comment.fbid + '/picture')
		thumb.attr('data-comment-id', comment._id)
		thumb.attr('data-position', comment.position)
		thumb.css('left', offset)
		$('.thumbnails-container').append(thumb)
	})
	$('.thumbnails-container img').hover(function(e) {
		if (e.type == 'mouseenter') {
			app.showComment($(e.target).attr('data-comment-id'))
		}
	})
	$('.thumbnails-container img').click(function(e) {
		app.player.seek(Math.round($(e.target).attr('data-position')))
	})
}

app.appendComment = function(comment){
	var offset = $('.thumbnails-container').width() * (comment.position / app.player.currentMetadata.duration)
	var thumb = $('<img class="comment-thumbnail">')
	thumb.attr('src', 'http://graph.facebook.com/' + comment.fbid + '/picture')
	thumb.attr('data-comment-id', comment._id)
	thumb.attr('data-position', comment.position)
	thumb.css('left', offset)
	$('.thumbnails-container').append(thumb)
}
app.initAddCommentFunctionality = function() {
	$('.cursor').click(app.addComment)
}

app.addComment = function() {
	$('.comment-containers').hide()
	$('.comment-form').show()
	app.newCommentPosition = app.player.playhead
	$('.new-comment-position').text(app.niceTime(app.player.playhead))
}

app.initialize = function() {
	var startingTime = parseFloat(window.location.hash.slice(1, -1)) || 0
	app.player.play()
	app.player.seek(startingTime)
	app.initCommentThumbnails()
	app.initAddCommentFunctionality()
}

app.player = new MTVNPlayer.Player($('.player')[0], app.playerOptions, {
	ready: app.initialize,
	mediaStart: function() {
		$.get('/get-comment', {mgid: 'test'}, app.initCommentThumbnails)
	},
	playheadUpdate: function(e) {
		$('.progress').css('width', ((e.data / app.player.currentMetadata.duration) * 100) + "%" )
		var currentComment = _.find(app.comments, function(comment){
			return comment.position < e.data
		})
		if (!currentComment.shown)
			app.showComment(currentComment._id)
		currentComment.shown = true
	}
});

window.fbAsyncInit = function() {
	FB.init({
	  appId      : '225822460961695',
	  xfbml      : true,
	  status	 : true,
	  version    : 'v2.0'
	});
	    FB.login(function(){
	    	FB.api('/me', 'GET', function(result) {
	    		app.userId = result.id
	    		$('.comment-form img').attr('src', 'http://graph.facebook.com/' + result.id + '/picture')
	    	})
	    }, {scope: 'publish_actions'});
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

