var IMG_LINK_PATT = new RegExp(/((http:\/\/)|(https:\/\/)).+\.(png|jpg|gif|svg)/g);

function setProfile(profile) {
  chrome.storage.sync.get(function(data) {
    data.curProfile = profile;
    alert("Profile set to <" + profile + ">.");
    if (!data.profiles) data.profiles = {};
    if (!data.profiles[profile]) {
      alert("Initializing new profile.");
      data.profiles[profile] = {
        "thumbs": [],
        "linkbars": {
          "top-left": {
            "title" : null,
            "links" : []
          },
          "top-right": {
            "title" : null,
            "links" : []
          },
          "bottom-right": {
            "title" : null,
            "links" : []
          },
          "bottom-left": {
            "title" : null,
            "links" : []
          }
        }
      }
    }
    chrome.storage.sync.set(data, function() {})
  })
}

// [{"image": ..., "link": ...}, ...]
function setProfileThumbs(profile, thumbArrayJSONString) {
  chrome.storage.sync.get(function(data) {
    if (!data.curProfile) alert('Profile not set');
    data.profiles[profile].thumbs = JSON.parse(thumbArrayJSONString)
    chrome.storage.sync.set(data, function() {
      alert("Set thumbs for <" + profile + ">.");
    });
  });
}

// {'top-left': ..., 'top-right': ..., ...}
function setProfileLinkbars(profile, linkbarArrayJSONString) {
  chrome.storage.sync.get(function(data) {
    if (!data.curProfile) alert('Profile not set');
    data.profiles[profile].linkbars = JSON.parse(linkbarArrayJSONString)
    chrome.storage.sync.set(data, function() {
      alert("Set thumbs for <" + profile + ">.");
    });
  });
}

function loadThumbs() {
  $('#thumbnail-container').empty();
  chrome.storage.sync.get(function(data) {
    if (!data.curProfile || !data.profiles[data.curProfile].thumbs) return;
    var thumbnails = data.profiles[data.curProfile];
    for (var i = 0; i < thumbnails.thumbs.length; i++) {
      $("#thumbnail-container").append(
        '<div class="thumbnail '+ (thumbnails.thumbs[i].url == 'empty' ? 'hidden' : 'clickable clickable-href') +'" href="'+ thumbnails.thumbs[i].url +'"> \
          <div class="thumbnail-background" style="background-image: url(' +
          (IMG_LINK_PATT.test(thumbnails.thumbs[i].img) ? thumbnails.thumbs[i].img : ('assets/images/'+ thumbnails.thumbs[i].img)) +
          ')"></div> \
        </div>'
      );
      $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);
      $('.thumbnail').css('height', $('.thumbnail').width()/16*9);
    }
    $('div.clickable-href').on('click', function(e) {
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

function loadLinkbars() {
  chrome.storage.sync.get(function(data) {
    if (!data.curProfile || !data.profiles[data.curProfile].linkbars) return;
    var linkbars = data.profiles[data.curProfile].linkbars;
    for (barname in linkbars) {
      if(linkbars[barname].title) {
        $("#links-bar-" + barname).append(linkbars[barname].title + ':&nbsp;&nbsp;');
      }
      for (var i = 0; i < linkbars[barname].links.length; i++) {
        $("#links-bar-" + barname).append((i == 0 ? '' : ' | ') + '<span class="links-bar-node clickable-href" href="' + linkbars[barname].links[i].url + '">' + linkbars[barname].links[i].name + '</span>');
      }
    }
    $('span.clickable-href').on("click", function(e) {
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


$(document).ready(function() {

  $('#thumbnail-container').bind('DOMNodeInserted DOMNodeRemoved', function () {
     $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);
     $('.thumbnail').css('height', $('.thumbnail').width()/16*9);
  });
  // $('#thumbnail-container').sortable();
  // $('#thumbnail-container').sortable('disable');
  loadThumbs();
  loadLinkbars();

  $(window).on('resize', function() {
    $('.thumbnail').css('height', $('.thumbnail').width()/16*9);
    $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);
  });

  $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);

  $('#settings').click(function() {loadSetup()});
});
