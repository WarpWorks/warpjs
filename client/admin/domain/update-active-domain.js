const warpjsUtils = require('@warp-works/warpjs-utils');

const updateActiveEntity = require('./update-active-entity');
const updateMyNavBar = require('./update-my-nav-bar');
const warpGlobals = require('./../warp-globals');

module.exports = (activeEntityArg) => {
    // Set domain name
    updateMyNavBar();

    // Clean up entity list
    $("#entityOverviewNP").empty();

    // Get sorted list of Entities
    var sortedEntityList = warpGlobals.$active.domain.getEntities(true);

    // Which is the active entity?
    var activeEntity = null;
    if (activeEntityArg) {
        activeEntity = activeEntityArg;
    } else if (warpGlobals.$active.entity) {
        activeEntity = warpGlobals.$active.entity.id;
    } else if (!activeEntity) {
        activeEntity = sortedEntityList.length > 0 ? sortedEntityList[0].id : null;
    }

    // Add new button for each entity
    if (sortedEntityList.length > 0) {
        sortedEntityList.forEach(function(entity, i) {
            var active = "";
            if (activeEntity) {
                active = warpjsUtils.compareIDs(entity.id, activeEntity) ? "class='active'" : "";
            }

            var name = entity.name.substring(0, 15);

            if (entity.isRootInstance) {
                name = "#" + name;
            }
            if (entity.isAbstract) {
                name = "%" + name;
            }

            var embedded = "<span class='glyphicon glyphicon-list'></span>";
            var document = "<span class='glyphicon glyphicon-file'></span>";
            name = (entity.isDocument() ? document : embedded) + ' ' + name;

            var elem = $(
                "<li " + active + "><a href='#' id='" + entity.id + "'data-toggle='tab'>" + name + "</a></li>");
            $("#entityOverviewNP").append(elem).append(" ");
            elem.click(function(event) {
                updateActiveEntity(event.target.id);
            });
        });
    }

    // Finally, set active entity
    if (activeEntity) {
        updateActiveEntity(activeEntity);
    } else {
        $("#entityPanelBodyD").hide();
    }
};
