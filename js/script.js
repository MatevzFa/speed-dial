var LINKSET = 'linkset-1';
var THUMBNAILS = 'thumbnails-1';

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
    $.getJSON(chrome.extension.getURL('/thumbnail-data/'+THUMBNAILS+'.json'), function(thumbnails) {
        for (var i = thumbnails.length - 1; i >= 0; i--) {
            $("#thumbnails-container").prepend(
                '<div class="thumbnail clickable" href="'+ thumbnails[i].link +'"> \
                    <div class="thumbnail-background" style="background-image: url(thumbnail-data/images/'+ thumbnails[i].image +')"></div> \
                </div>'
            )
            position();
        }

    });
}

function loadLinkBars() {
    $.getJSON(chrome.extension.getURL('/link-bar-data/'+LINKSET+'.json'), function(linkset) {
        for (barname in linkset) {
            if(linkset[barname].title) {
                $("#links-bar-" + barname).append(linkset[barname].title + ':&nbsp;&nbsp;');
            }
            for (var i = 0; i < linkset[barname].links.length; i++) {
                $("#links-bar-" + barname).append((i == 0 ? '' : ' | ') + '<span class="links-bar-node clickable" href="' + linkset[barname].links[i].url + '">' + linkset[barname].links[i].name + '</span>');
            }
        }
        $(".clickable").on("mouseup", function(e) {
          switch(e.which) {
            case 1:
              window.location = $(this).attr('href');
              break;
            case 2:
              window.open($(this).attr('href'));
              break;
            case 3:
              return;
          }
        });
    });
}

});
