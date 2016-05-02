window.addEventListener('load', function() {
loadThumbs();
loadLinkBars();
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
    if (containerHeight + 66 < windowHeight)
        $("#thumbnails-container").css("margin-top", windowHeight/2 - containerHeight/2);
    else
        $("#thumbnails-container").css("margin-top", 33);

    $(".thumbnail").css("height", $(".thumbnail").width()/16*9);
    $(".thumbnail").css("height", $(".thumbnail").css("line-height", $(".thumbnail").height() + 'px'));
});

function loadThumbs(callback) {

    for (var i = thumbnailData.thumbs.length - 1; i >= 0; i--) {
        $("#thumbnails-container").prepend(
            '<div class="thumbnail clickable" href="'+ thumbnailData.thumbs[i].link +'"> \
                <div class="thumbnail-background" style="background-image: url(thumbnail-data/images/'+ thumbnailData.thumbs[i].image +')"></div> \
            </div>'
        )
        position();
    }
}

function loadLinkBars() {
    for (barname in linkset_1) {
        if(linkset_1[barname].title) {
            console.log("#links-bar-" + barname);
            $("#links-bar-" + barname).append(linkset_1[barname].title + ': ');
        }
        for (var i = 0; i < linkset_1[barname].links.length; i++) {
            $("#links-bar-" + barname).append((i == 0 ? '' : ' | ') + '<span class="links-bar-node clickable" href="' + linkset_1[barname].links[i].url + '">' + linkset_1[barname].links[i].name + '</span>');
        }
    }
}

$(".clickable").click(function() {
    window.location = $(this).attr('href');
})

});
