const addNewPageView = require('./add-new-page-view');
const addNewTableView = require('./add-new-table-view');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Update page view list
    var sortedPageViewList = warpGlobals.$active.entity.getPageViews(true);
    $("#pageViewsNP").empty();
    sortedPageViewList.forEach(function(pageView, i) {
        // TODO: Generate this on server.
        var url = '../pageView/' + warpGlobals.$active.domain.name + '?pv=' + pageView.id;
        var elem = $('<li><a href="' + url + '" id="' + pageView.id + '">' + pageView.name + '</a></li>');
        $("#pageViewsNP").append(elem).append(" ");
    });

    // Add "new page view" button
    var elem = $("<li><a href='#' id='addPageViewA' data-toggle='tab'><span class='glyphicon glyphicon-plus-sign'></span></a></li>");
    $("#pageViewsNP").append(elem);
    elem.click(addNewPageView);

    // ...and now table views
    var sortedTableViewList = warpGlobals.$active.entity.getTableViews(true);
    $("#tableViewsNP").empty();
    sortedTableViewList.forEach(function(tableView, i) {
        // TODO: Generate this on server.
        var url = "./../tableView/" + warpGlobals.$active.domain.name + "?tv=" + tableView.id;
        var elem = $('<li><a href="' + url + '" id="' + tableView.id + '">' + tableView.name + '</a></li>');
        $("#tableViewsNP").append(elem).append(" ");
    });

    // Add "new table view" button
    elem = $("<li><a href='#' id='addTableViewA' data-toggle='tab'><span class='glyphicon glyphicon-plus-sign'></span></a></li>");
    $("#tableViewsNP").append(elem);
    elem.click(addNewTableView);
};
