const updateActiveAssociation = require('./update-active-association');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Create new Association
    var newAssociation = warpGlobals.$active.entity.addNew_Relationship("New_Association", "");
    newAssociation.isAggregation = false;

    // Now update the active association
    updateActiveAssociation(newAssociation.id);

    // Selected "name" text from newly created assoc
    $("#associationNameI").focus().select();
};
