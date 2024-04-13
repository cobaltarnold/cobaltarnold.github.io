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
    $("html, body").css("background", "#F5F5EE");
    $("#sketchbook").css("margin-right", "0");
    e.stopPropagation();
  } );
});