const WarpPanelItem = require('./panel-item');

class WarpRelationshipPanelItem extends WarpPanelItem {
    constructor(parent, config) {
        super(parent, "Relationship", config);
        this.relationshipID = config.relationship[0];
        this.style = config.style;
        this.view = null;

        this.relnDetails = $warp.model.getRelationshipDetails(this.relationshipID);

        this.getPageView().addRelationship(this.relationshipID);
    }

    getRelationshipProxy() {
        var pv = this.getPageView();
        var ep = pv.getEntityProxy();
        var rp = ep.getRelationshipProxy(this.relationshipID);
        return rp;
    }
}

module.exports = WarpRelationshipPanelItem;
