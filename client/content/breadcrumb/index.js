// const itemsTemplate = require('./items.hbs');
// const template = require('./template.hbs');
const WarpWidget = require('./../widget');

class WarpBreadcrumb extends WarpWidget {
    updateViewWithDataFromModel(callback) {
        var ep = $warp.pageView.getEntityProxy();
        ep.useData((ep) => {
            // const content = itemsTemplate({
            //     isRootInstance: ep.data.isRootInstance,
            //     isAddNewEntity: (ep.mode === 'addNewEntity'),
            //     items: ep.breadcrumb
            // });

            // $(`#${this.globalID()}`).html(content);
            // callback();
        });
    }

    createViews(parentHtml, callback) {
        // const content = template({
        //     globalID: this.globalID()
        // });

        // const bc = $(content);

        // parentHtml.append(bc);
        // callback();
    }
}

module.exports = WarpBreadcrumb;
