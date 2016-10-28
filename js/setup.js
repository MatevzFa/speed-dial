function loadSetup() {
  $('#thumbnail-container').empty();
  $('#thumbnail-container').sortable();
  $('.links-bar').empty();

  chrome.storage.sync.get(function(data) {
    if (!data.curProfile) setProfile('default');
    var thumbnails = data.profiles[data.curProfile];

    for (var i = 0; i < thumbnails.thumbs.length; i++) {
      $("#thumbnail-container").append(' \
      \
        <div class="thumbnail setup-thumb"> \
          <textarea style="margin-top: 1em;" rows="2" cols="35" placeholder="URL">' + thumbnails.thumbs[i].url + '</textarea> \
          <textarea rows="2" cols="35" placeholder="Image">' + thumbnails.thumbs[i].img + '</textarea><br> \
          <img class="remove-thumb clickable" src="assets/icons/ic_clear_white_24px.svg"> \
        </div>');
    }
    $(document).on('click', '.remove-thumb', function() {
      console.log('btn remove');
      $(this).parents("div:first").remove();
    });

    $("#thumbnail-container").append(' \
      <div class="thumbnail add-thumb clickable"> \
        <div class="thumbnail-background" style="background-image: url(assets/icons/ic_add_circle_outline_white_24px.svg)"></div> \
      </div> \
    ');

    $('.add-thumb').click(function() {
      $(".add-thumb").before(' \
        <div class="thumbnail setup-thumb"> \
          <textarea style="margin-top: 1em;" rows="2" cols="35" placeholder="URL"></textarea> \
          <textarea rows="2" cols="35" placeholder="Image"></textarea><br> \
          <img class="remove-thumb clickable" src="assets/icons/ic_clear_white_24px.svg"> \
        </div> \
        ');
    });

    $("#thumbnail-container").append(' \
      <div class="thumbnail save-thumbs clickable"> \
        <div class="thumbnail-background" style="background-image: url(assets/icons/ic_save_white_24px.svg)"></div> \
      </div> \
    ');
    $(".save-thumbs").click(function() {saveSetup()});

    for (linkbar in data.profiles[data.curProfile].linkbars) {
      $('#links-bar-' + linkbar).append('\
        <textarea id="lb-' + linkbar + '-setup">' + JSON.stringify(data.profiles[data.curProfile].linkbars[linkbar], null, '  ') + '</textarea> \
      ');
    }

  });
}

function saveSetup() {
  $('#thumbnail-container').sortable('destroy');
  chrome.storage.sync.get(function(data) {
    if (!data.curProfile || !data.profiles[data.curProfile].thumbs) return;
    data.profiles[data.curProfile];
    data.profiles[data.curProfile].thumbs = [];
    console.log($('.setup-thumb').length);
    for (var i = 0; i < $('.setup-thumb').length; i++) {
      if ($('.setup-thumb').eq(i).find('textarea').eq(0).val().length > 0) {
        data.profiles[data.curProfile].thumbs.push({
          url: $('.setup-thumb').eq(i).find('textarea').eq(0).val(),
          img: $('.setup-thumb').eq(i).find('textarea').eq(1).val()
        });

        console.log({
          url: $('.setup-thumb').eq(i).find('textarea').eq(0).val(),
          img: $('.setup-thumb').eq(i).find('textarea').eq(1).val()
        });

      }
    }

    for (linkbar in data.profiles[data.curProfile].linkbars) {
      data.profiles[data.curProfile].linkbars[linkbar] = JSON.parse(($('#lb-' + linkbar + '-setup').val()).replace(/(?:\r\n|\r|\n)/g, ''));
    }

    chrome.storage.sync.set(data, function() {
      $('.links-bar').empty();
      loadThumbs();
      loadLinkbars();
    });
  });
}
