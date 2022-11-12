function switchTo1() {
    removeActive();
    hideAll();
    $("#tab-1").addClass("is-active");
    $("#tab-1-content").removeClass("is-hidden");
}

function switchTo2() {
    removeActive();
    hideAll();
    $("#tab-2").addClass("is-active");
    $("#tab-2-content").removeClass("is-hidden");
}

function switchTo3() {
    removeActive();
    hideAll();
    $("#tab-3").addClass("is-active");
    $("#tab-3-content").removeClass("is-hidden");
}

function removeActive() {
    $("li").each(function () {
        $(this).removeClass("is-active");
    });
}

function hideAll() {
    $("#tab-1-content").addClass("is-hidden");
    $("#tab-2-content").addClass("is-hidden");
    $("#tab-3-content").addClass("is-hidden");
}
