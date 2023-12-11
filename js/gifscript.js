$(function() {
    $("#sketchbook").hover(
        function() {
            $(this).attr("src", "../assets/sketchbook/sketchbookopen.gif");
        },
        function() {
            $(this).attr("src", "../assets/sketchbook/sketchbookclose.gif");
        }                         
    );                  
});