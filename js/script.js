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

    function loadThumbs(profile) {

        $.ajax({
            dataType  : 'json',
            url : 'profiles/' + (profile == null ? 'default' : profile) + '/thumbnails.json',
            success : function(thumbnails) {
                for (var i = thumbnails.thumbs.length - 1; i >= 0; i--) {
                    $("#thumbnails-container").prepend(
                        '<div class="thumbnail '+ (thumbnails.thumbs[i].link == null ? 'hidden' : 'clickable') +'" href="'+ thumbnails.thumbs[i].link +'"> \
                        <div class="thumbnail-background" style="background-image: url(profiles/' + (profile == null ? 'default' : profile) + '/images/'+ thumbnails.thumbs[i].image +')"></div> \
                        </div>'
                    )
                    position();
                }
                $('div.clickable').on("mouseup", function(e) {
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
            },
            error : function(err) {
                console.log('Erorr loading linkbars from profile: %s', (profile == null ? 'default' : profile));
            }
        });


    }

    function loadLinkBars(profile) {
        $.ajax({
            dataType  : 'json',
            url : 'profiles/' + (profile == null ? 'default' : profile) + '/linkbars.json',
            success : function(linkbars) {
                for (barname in linkbars) {
                    if(linkbars[barname].title) {
                        $("#links-bar-" + barname).append(linkbars[barname].title + ':&nbsp;&nbsp;');
                    }
                    for (var i = 0; i < linkbars[barname].links.length; i++) {
                        $("#links-bar-" + barname).append((i == 0 ? '' : ' | ') + '<span class="links-bar-node clickable" href="' + linkbars[barname].links[i].url + '">' + linkbars[barname].links[i].name + '</span>');
                    }
                }
                $('span.clickable').on("click", function(e) {
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
            },
            error : function(err) {
                console.log('Erorr loading linkbars from profile: %s', (profile == null ? 'default' : profile));
            }
        });
    }

});
