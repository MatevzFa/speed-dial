
window.browser = (() => {
    return window.browser
        || window.chrome;
})();

$(document).ready(function () {

    $('#thumbnail-container').bind('DOMNodeInserted DOMNodeRemoved', function () {
        $('#thumbnail-container').css('margin-top', $(window).height() / 2 - $('#thumbnail-container').height() / 2);
        $('.thumbnail').css('height', $('.thumbnail').width() / 16 * 9);
    });

    $('#settings').css({
        opacity: '0.8',
        width: '3em',
        height: '3em'
    });
    loadThumbs();
    loadLinkbars();

    $(window).on('resize', function () {
        $('.thumbnail').css('height', $('.thumbnail').width() / 16 * 9);
        $('#thumbnail-container').css('margin-top', $(window).height() / 2 - $('#thumbnail-container').height() / 2);
    });

    $('#thumbnail-container').css('margin-top', $(window).height() / 2 - $('#thumbnail-container').height() / 2);

    $('#settings').click(function () { loadSetup() });
});

function setProfile(profile) {
    browser.storage.sync.get(function (data) {
        data.curProfile = profile;
        alert("Profile set to <" + profile + ">.");
        if (!data.profiles) data.profiles = {};
        if (!data.profiles[profile]) {
            alert("Initializing new profile.");
            data.profiles[profile] = {
                "thumbs": [],
                "linkbars": {
                    "top-left": {
                        "title": null,
                        "links": []
                    },
                    "top-right": {
                        "title": null,
                        "links": []
                    },
                    "bottom-right": {
                        "title": null,
                        "links": []
                    },
                    "bottom-left": {
                        "title": null,
                        "links": []
                    }
                }
            }
        }
        browser.storage.sync.set(data, function () { })
    })
}

function exportSettings() {
    browser.storage.sync.get(function (data) {
        $("<a />", {
            download: "speed-dial-" + (new Date()).toISOString().substring(0, 19).replace(/\:/g, '-') + ".json",
            href: "data:application/json," + encodeURIComponent(JSON.stringify(data, null, '  '))
        }).appendTo("body")
            .click(function () {
                $(this).remove()
            })[0].click()
    })
}

function importSettings() {
    if ($('body #import-area')) {
        $div = $('<div>', { id: 'import-area', style: "position: fixed; top: 50px; left: 25%;" })
        $textarea = $('<textarea>', { rows: "40", cols: "80", placeholder: "JSON", style: "font-size: 10pt" })
        $btn = $('<button>', { text: "Import" })
        $('body').append($div)
        $('body #import-area').append($textarea)
        $('body #import-area').append($btn);
        $('body #import-area button').click(function () {
            if ($('body #import-area textarea').val().length > 0) {
                browser.storage.sync.set(JSON.parse($('body #import-area textarea').val()), function () {
                    $('#import-area').remove();
                    loadSetup();
                })
            } else {
                $('body #import-area').remove();
            }
        })
    }
}

// [{"image": ..., "link": ...}, ...]
function setProfileThumbs(profile, thumbArrayJSONString) {
    browser.storage.sync.get(function (data) {
        if (!data.curProfile) alert('Profile not set');
        data.profiles[profile].thumbs = JSON.parse(thumbArrayJSONString)
        browser.storage.sync.set(data, function () {
            alert("Set thumbs for <" + profile + ">.");
        });
    });
}

// {'top-left': ..., 'top-right': ..., ...}
function setProfileLinkbars(profile, linkbarArrayJSONString) {
    browser.storage.sync.get(function (data) {
        if (!data.curProfile) alert('Profile not set');
        data.profiles[profile].linkbars = JSON.parse(linkbarArrayJSONString)
        browser.storage.sync.set(data, function () {
            alert("Set thumbs for <" + profile + ">.");
        });
    });
}

function loadThumbs() {
    $('#thumbnail-container').empty();
    browser.storage.sync.get(function (data) {
        if (!data.curProfile || !data.profiles[data.curProfile].thumbs) return;

        $('#settings').css({
            opacity: '0.05',
            width: '1em',
            height: '1em'
        });

        var thumbnails = data.profiles[data.curProfile];
        for (let i = 0; i < thumbnails.thumbs.length; i++) {
            $('#thumbnail-container').append(
                $('<a />', {
                    class: 'thumbnail ' + (thumbnails.thumbs[i].url == 'empty' ? 'hidden' : 'clickable clickable-href'),
                    href: thumbnails.thumbs[i].url
                }).append(
                    $('<div />', {
                        class: 'thumbnail-background',
                        style: 'background-image: url(' + linkify(thumbnails.thumbs[i].img) + ')'
                    })
                    )
            )
        }
        $('#thumbnail-container').append($('<div />', { style: 'clear: left; display: block;' }))
    });
}

function linkify(url) {
    var patt = /^(http:\/\/|https:\/\/).+?\.(png|jpg|gif|svg)$/;
    if (patt.test(url)) {
        return url
    } else {
        return 'assets/images/' + url
    }
}

function loadLinkbars() {
    browser.storage.sync.get(function (data) {
        if (!data.curProfile || !data.profiles[data.curProfile].linkbars) return;
        var linkbars = data.profiles[data.curProfile].linkbars;
        for (barname in linkbars) {
            if (linkbars[barname].title) {
                $("#links-bar-" + barname).append(linkbars[barname].title + ':&nbsp;&nbsp;');
            }
            for (var i = 0; i < linkbars[barname].links.length; i++) {
                $("#links-bar-" +
                    barname).append((i == 0 ? '' : ' | ') +
                    '<a class="links-bar-node clickable-href" href="' + linkbars[barname].links[i].url + '">' + linkbars[barname].links[i].name + '</a>'
                    );
            }
        }
    });
}


