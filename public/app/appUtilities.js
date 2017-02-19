HeadStart_getURLParam = function (argName) {
    var urlSearch = window.location.search;
    var arg = urlSearch.split(argName+"=");
    if (arg.length<2) return null;
    return arg[1].split("&")[0];
}
