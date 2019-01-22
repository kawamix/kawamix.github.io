defaultGraphMaxWidth = "500px"

$("li img").click(function () {
    if ($(this).css("max-width") == defaultGraphMaxWidth) {
        $(this).css("max-width", "100%");
    } else if($(this).css("max-width") == "100%"){
        $(this).css("max-width", defaultGraphMaxWidth);
    }else{
        window.location.href = $(this).prop("src");
    }
})