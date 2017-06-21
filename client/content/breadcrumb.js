const WarpWidget = require('./widget');

class WarpBreadcrumb extends WarpWidget {
    // constructor(parent, config) {
    //     super(parent, config);
    // }

    updateViewWithDataFromModel(callback) {
        var ep = $warp.pageView.getEntityProxy();
        ep.useData(function(ep) {
            var href;
            var li;

            var bc = $("#" + this.globalID()).empty();
            if (ep.data.isRootInstance) {
                href = $warp.links.domain.href + '/' + ep.type;
                li = "<li class='breadcrumb-item'><a href='" + href + "'>" + ep.type + "</a></li>";
                bc.append(li);
            } else if (ep.mode === "addNewEntity") {
                li = "<li class='breadcrumb-item'>Create new " + ep.type + "</li>";
                bc.append(li);
            } else {
                var breadcrumb = ep.breadcrumb;
                for (var idx = 0; idx < breadcrumb.length; idx++) {
                    var item = breadcrumb[idx];
                    href = $warp.links.domain.href + '/' + item.type;
                    li = "<li class='breadcrumb-item'><a href='" + href + "?oid=" + item._id + "' data-toggle='tooltip' title='" + item.type + "'>" + item.shortHand + "</a></li>";
                    bc.append(li);
                }
            }
            callback();
        }.bind(this));
    }

    createViews(parentHtml, callback) {
        var bc = $(
            '<ol class="breadcrumb">' +
        '   Breadcrumb' +
        '</ol>');
        bc.prop('id', this.globalID());

        parentHtml.append(bc);
        callback();
    }
}

module.exports = WarpBreadcrumb;
