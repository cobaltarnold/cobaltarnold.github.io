window.onload = rotate;
var n = 1;

function rotate() {
  if (n == 21) {
    n = 1;
  }
  document.getElementById("artimg").src = "../assets/artwork/artwork" + n + ".png";
  n++;
  setTimeout(rotate, 150);
}

$(document).ready(function(){
  $.each($('img'), function() {
    if ( $(this).attr('data-src') && $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) ) {
        var source = $(this).data('src');
        $(this).attr('src', source);
        $(this).removeAttr('data-src');
    }
  });
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

$(window).scroll(function() {
  $.each($('img'), function() {
      if ( $(this).attr('data-src') && $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) ) {
          var source = $(this).data('src');
          $(this).attr('src', source);
          $(this).removeAttr('data-src');
      }
  });
});