function setProfile(profile) {
  chrome.storage.sync.set({"curProfile": profile}, function(){
    alert("Profile set to <" + profile + ">.");
  })
}

// [{"image": ..., "link": ...}, ...]
function setProfileThumbs(profile, thumbArrayJSONString) {
  chrome.storage.sync.get(function(data) {
    data.profiles[profile].thumbs = JSON.parse(thumbArrayJSONString)
    chrome.storage.sync.set(data, function() {
      alert("Set thumbs for <" + profile + ">.");
    });
  });
}

// {'top-left': ..., 'top-right': ..., ...}
function setProfileLinkbars(profile, linkbarArrayJSONString) {
  chrome.storage.sync.get(function(data) {
    data.profiles[profile].linkbars = JSON.parse(linkbarArrayJSONString)
    chrome.storage.sync.set(data, function() {
      alert("Set thumbs for <" + profile + ">.");
    });
  });
}

function loadThumbs() {
  chrome.storage.sync.get(function(data) {
    var thumbnails = data.profiles[data.curProfile];
    console.log(thumbnails.thumbs);
    for (var i = 0; i < thumbnails.thumbs.length; i++) {
      console.log(i);
      $("#thumbnail-container").append(
        '<div class="thumbnail '+ (thumbnails.thumbs[i].link == null ? 'hidden' : 'clickable') +'" href="'+ thumbnails.thumbs[i].link +'"> \
          <div class="thumbnail-background" style="background-image: url(profiles/' + data.curProfile + '/images/'+ thumbnails.thumbs[i].image +')"></div> \
        </div>'
      );
    }
    $('div.clickable').on("click", function(e) {
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

function loadLinkBars() {
  chrome.storage.sync.get(function(data) {
    var linkbars = data.profiles[data.curProfile].linkbars;
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
  });
}


$(document).ready(function() {

  chrome.storage.sync.get(function(data) {
    $('head').append('<link rel="stylesheet" type="text/css" href="profiles/' + data.curProfile + '/css/style.css">');
  });
  loadThumbs();
  loadLinkBars();
  $('#thumbnail-container').bind('DOMNodeInserted DOMNodeRemoved', function () {
     $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);
     $('.thumbnail').css('height', $('.thumbnail').width()/16*9);
  });

  $(window).on('resize', function() {
    $('.thumbnail').css('height', $('.thumbnail').width()/16*9);
    $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);
  })

  $('#thumbnail-container').css('margin-top', $(window).height()/2 - $('#thumbnail-container').height()/2);
});
