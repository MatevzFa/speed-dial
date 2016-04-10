window.addEventListener('load', function() {
loadThumbs();

function setMaxWidth() {
    // var sw = 3840;
    var sw = screen.width;
    $("#thumbnails-container").css("max-width", sw > 1920 ? 2*sw/3 : 1280);
}

function position() {
    setMaxWidth();
    var containerHeight = $("#thumbnails-container").height();
    var windowHeight = $(window).height();
    $("#thumbnails-container").css("margin-top", windowHeight/2 - containerHeight/2);
    $(".thumbnail").css("height", $(".thumbnail").width()/16*9);
    $(".thumbnail").css("height", $(".thumbnail").css("line-height", $(".thumbnail").height() + 'px'));
    $(".thumbnail").css("background-size", "fit");
}

window.addEventListener('resize', function() {
    position();
    setMaxWidth();
    var containerHeight = $("#thumbnails-container").height();
    var windowHeight = $(window).height();
    if (containerHeight + 50 < windowHeight)
        $("#thumbnails-container").css("margin-top", windowHeight/2 - containerHeight/2);
    else
        $("#thumbnails-container").css("margin-top", 25);

    $(".thumbnail").css("height", $(".thumbnail").width()/16*9);
    $(".thumbnail").css("height", $(".thumbnail").css("line-height", $(".thumbnail").height() + 'px'));
});

function loadThumbs(callback) {
    var thumbnailData = {
        "name"      : "Test1",
        "thumbs"    : [
            {
                "title" :   "Twitch",
                "image" :   "twitch.png",
                "link"  :   "https://www.twitch.tv/"
            },
            {
                "title" :   "YouTube",
                "image" :   "youtube2.png",
                "link"  :   "https://www.youtube.com/feed/subscriptions"
            },
            {
                "title" :   "Facebook",
                "image" :   "facebook.png",
                "link"  :   "https://www.facebook.com/"
            },
            {
                "title" :   "Twitter",
                "image" :   "twitter.png",
                "link"  :   "https://twitter.com/"
            },
            {
                "title" :   "Old School RuneScape",
                "image" :   "osrs.png",
                "link"  :   "http://runescape.com/community"
            },
            {
                "title" :   "Spletna učilnica FRI",
                "image" :   "fri.png",
                "link"  :   "https://ucilnica.fri.uni-lj.si/login/index.php"
            },
        ]
    };


    for (var i = thumbnailData.thumbs.length - 1; i >= 0; i--) {
        $("#thumbnails-container").prepend(
            '<a href="'+ thumbnailData.thumbs[i].link +'"> \
                <div class="thumbnail"> \
                    <div class="thumbnail-background" style="background-image: url(thumbnail-data/images/'+ thumbnailData.thumbs[i].image +')"></div> \
                </div> \
            </a>'
        )
        position();
    }
}
});
