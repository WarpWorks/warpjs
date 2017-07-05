const warpGlobals = require('./../warp-globals');

module.exports = (context) => {
    var rows = "";
    warpGlobals.$active.domain.entities.forEach(function(entity) {
        rows += "<tr class='entity-selection-row' data-href='" + entity.id + "'>" +
            "<td>" + entity.name + "</td>" +
            "<td>" + entity.desc + "</td>" +
            "<td><span class='glyphicon glyphicon-circle-arrow-right'></span></td>" +
            "</tr>";
    });
    $("#selectElement_ElementsT").html($("<tbody>" + rows + "</tbody>"));

    switch (context) {
        case "aggregation":
            $("#selectElement_titleH").text("Select Aggregation Target");
            $(".entity-selection-row").click(function() {
                warpGlobals.$active.aggregationTarget = warpGlobals.$active.domain.findElementByID($(this).data("href"));
                $("#aggregationTargetNameA").text(warpGlobals.$active.aggregationTarget.name);

                // Save to Aggregation object!
                warpGlobals.$active.aggregation.setTargetEntity(warpGlobals.$active.aggregationTarget);

                // Update description
                warpGlobals.$active.aggregation.updateDesc();
                $("#aggregationDescI").val(warpGlobals.$active.aggregation.desc);

                $("#selectElementM").modal('hide');
            });
            break;
        case "association":
            $("#selectElement_titleH").text("Select Association Target");
            $(".entity-selection-row").click(function() {
                warpGlobals.$active.associationTarget = warpGlobals.$active.domain.findElementByID($(this).data("href"));
                $("#associationTargetNameA").text(warpGlobals.$active.associationTarget.name);

                // Save to Aggregation object!
                warpGlobals.$active.association.setTargetEntity(warpGlobals.$active.associationTarget);

                // Update description
                warpGlobals.$active.association.updateDesc();
                $("#associationDescI").val(warpGlobals.$active.association.desc);

                $("#selectElementM").modal('hide');
            });
            break;
        case "inheritance":
            $("#selectElement_titleH").text("Select Parent Entity");
            $(".entity-selection-row").click(function() {
                var pc = warpGlobals.$active.domain.findElementByID($(this).data("href"));
                warpGlobals.$active.entity.setParentClass(pc);
                $("#parentEntityNameA").text(pc.name);

                $("#selectElementM").modal('hide');
            });
            break;
        default:
            throw new Error("Undefined: " + context);
    }

    $("#selectElementM").modal();
};
