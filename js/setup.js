
const TEXTARE_FONT_SIZE = 'font-size: 8pt';

function loadSetup() {
    $('#thumbnail-container').empty();
    $('#thumbnail-container').sortable({
        items: '> .sortable'
    });
    $('.links-bar').empty();

    browser.storage.sync.get(function (data) {
        if (!data.curProfile) setProfile('default');
        var thumbnails = data.profiles[data.curProfile];

        for (var i = 0; i < thumbnails.thumbs.length; i++) {
            $('#thumbnail-container').append(
                $('<div />', {
                    class: 'thumbnail setup-thumb sortable'
                })
                    .append($('<textarea />', {
                        rows: 3, cols: 35, placeholder: 'URL',
                        style: TEXTARE_FONT_SIZE,
                        text: thumbnails.thumbs[i].url
                    })).append('<br>')
                    .append($('<textarea />', {
                        rows: 4, cols: 35, placeholder: 'Image',
                        style: TEXTARE_FONT_SIZE,
                        text: thumbnails.thumbs[i].img
                    })).append('<br>')
                    .append($('<img />', {
                        class: 'remove-thumb clickable',
                        src: 'assets/icons/ic_clear_white_24px.svg',
                        click: function (e) {
                            $(this).parents("div:first").remove();
                        }
                    }))
            )
        }

        $('#thumbnail-container').append(
            $('<div />', {
                class: 'thumbnail clickable settings-thumbnail add-thumb',
                click: function (e) {
                    $(".add-thumb").before(
                        $('<div />', {
                            class: 'thumbnail setup-thumb sortable'
                        })
                            .append($('<textarea />', {
                                rows: 3, cols: 35, placeholder: 'URL',
                                style: TEXTARE_FONT_SIZE
                            }))
                            .append($('<textarea />', {
                                rows: 4, cols: 35, placeholder: 'Image',
                                style: TEXTARE_FONT_SIZE
                            }))
                            .append($('<img />', {
                                class: 'remove-thumb clickable',
                                src: 'assets/icons/ic_clear_white_24px.svg',
                                click: function (e) {
                                    $(this).parents("div:first").remove();
                                }
                            }))
                    )
                }
            })
                .append($('<div />', {
                    class: 'thumbnail-background',
                    style: 'background-image: url(assets/icons/ic_add_circle_outline_white_24px.svg);'
                }))
        )

        $('#thumbnail-container').append(
            $('<div />', {
                class: 'thumbnail clickable settings-thumbnail',
                click: function (e) { saveSetup() }
            })
                .append($('<div />', {
                    class: 'thumbnail-background',
                    style: 'background-image: url(assets/icons/ic_save_white_24px.svg);'
                }))
        )

        $('#thumbnail-container').append(
            $('<div />', {
                class: 'thumbnail clickable settings-thumbnail',
                click: function (e) { exportSettings() }
            })
                .append($('<div />', {
                    class: 'thumbnail-background',
                    style: 'background-image: url(assets/icons/ic_file_download_white_24px.svg);'
                }))
        )

        $('#thumbnail-container').append(
            $('<div />', {
                class: 'thumbnail clickable settings-thumbnail',
                click: function (e) { importSettings() }
            })
                .append($('<div />', {
                    class: 'thumbnail-background',
                    style: 'background-image: url(assets/icons/ic_file_upload_white_24px.svg);'
                }))
        )

        $('#thumbnail-container').append($('<div />', { style: 'clear: left; display: block;' }))

        for (linkbar in data.profiles[data.curProfile].linkbars) {
            $('#links-bar-' + linkbar).append(
                $('<textarea />', {
                    id: 'lb-' + linkbar + '-setup',
                    rows: 4, cols: 40,
                    text: JSON.stringify(data.profiles[data.curProfile].linkbars[linkbar], null, '  '),
                    style: 'max-height: 500px; max-width: 500px'
                })
            );
        }
    });
}

function saveSetup() {
    $('#thumbnail-container').sortable('destroy');
    browser.storage.sync.get(function (data) {
        if (!data.curProfile || !data.profiles[data.curProfile].thumbs) return;
        data.profiles[data.curProfile];
        data.profiles[data.curProfile].thumbs = [];
        for (var i = 0; i < $('.setup-thumb').length; i++) {
            if ($('.setup-thumb').eq(i).find('textarea').eq(0).val().length > 0) {
                data.profiles[data.curProfile].thumbs.push({
                    url: $('.setup-thumb').eq(i).find('textarea').eq(0).val(),
                    img: $('.setup-thumb').eq(i).find('textarea').eq(1).val()
                });
            }
        }

        for (linkbar in data.profiles[data.curProfile].linkbars) {
            data.profiles[data.curProfile].linkbars[linkbar] = JSON.parse(($('#lb-' + linkbar + '-setup').val()).replace(/(?:\r\n|\r|\n)/g, ''));
        }

        browser.storage.sync.set(data, function () {
            $('.links-bar').empty();
            loadThumbs();
            loadLinkbars();
        });
    });
}
