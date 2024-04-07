$(document).ready(function(){
  $(".piece").click(function(){
     $(".info#"+this.id).addClass("shown");
     $(".infobg").addClass("shown");
     $("html, body").css("overflow-y", "hidden");
     $("html, body").css("margin-right", "8px");
     $("html, body").css("background", "gray");
     $("#sketchbook").css("margin-right", "17px");
   } );

  $(".info").click(function(e){
    $(this).removeClass("shown");
    $(".infobg").removeClass("shown");
    $("html, body").css("overflow-y", "visible");
    $("html, body").css("margin-right", "0");
    $("html, body").css("background", "white");
    $("#sketchbook").css("margin-right", "0");
    e.stopPropagation();
  } );
});

document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});