function customLinksRemoveEntityFromSelectionList(relationship) {
    var id = $(this).attr('id').split(":")[1];
    $(this).remove();
    $active.entity.changed=true;
}

function customLinksAddTargetToEntityModal(label, target) {
    var elemID = "Content-DefaultTableView-Delete:" + target.id;
    var elem = $('<li role="presentation" id="' + elemID + '"><a href="#">'
               + label + ' <span class="glyphicon glyphicon-remove"></span></a></li>');
    $("#selectEntityM_selectionUL").append(elem);
    elem.click(customLinksRemoveEntityFromSelectionList);
}

// Update modal for entity selection (create target list, paging, search, etc.)
function customLinksUpdateSelectEntityModal(callback, clear) {
    // Set title
    $("#selectEntityM_titleH").html("Select Content");
    if(clear) {
        $('#selectEntityM_searchInput').val('');
    }

    // Update table with potential targets
    var widgetID="Content";
    $active.entityTables[widgetID].updateTable();

    // Update list of selected targets:
    $("#selectEntityM_selectionUL").empty();

    // Callbacks for pills representing selected entities
    $("." + $active.entityTables[widgetID].table + "-row").click(function () {
        var id = $(this).attr('id').split(":")[1];
        var target = getIICAdmin().findOrAddToEntityCache(id, "Content");
        var label = target.getShorthand();
        customLinksAddTargetToEntityModal(label, target);
    });

    // Callback to close Modal
    if(!$._data($("#selectEntityM_selectB")[0], "events")){
        $("#selectEntityM_selectB").on("click", function () {
            var content = [];
            $("#selectEntityM_selectionUL").children().get().forEach((liNode, index) => {
                var id = $(liNode).attr('id').split(":")[1];
                var name = $(liNode).text().trim();
                var entityType = "";
                $active.relationship.queryResults.forEach((resultObject) => {
                    if(resultObject.id === id) {
                        entityType = resultObject.constructor.name;
                    }
                });
                content.push("\{\{" + name + "," + entityType + "," + id + "\}\}");
            });
            $('#selectEntityM_searchInput').val('');
            callback(content);
        });
    }
}
