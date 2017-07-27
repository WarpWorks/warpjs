const warpjsUtils = require('@warp-works/warpjs-utils');

const WarpTable = require('./table');

class WarpAssociationEditor {
    constructor(warpWidget, sourceEntityProxy, relationshipID, globalID) {
        this.warpWidget = warpWidget;
        this.sourceEntityProxy = sourceEntityProxy;
        this.relationshipID = relationshipID;
        this.maxAssocs = 100;
        this._globalID = globalID;
    }

    init() {
    // Get relationship details:
        this.relnJson = $warp.model.getRelationshipByID(this.relationshipID);
        this.sourceJson = $warp.model.getRelnParentByID(this.relationshipID);
        this.targetJson = $warp.model.getEntityByID(this.relnJson.targetEntity[0]);

        // List of derived entities
        var targetEntites = null;
        if (this.targetJson.isAbstract) {
            targetEntites = $warp.model.getDerivedEntitiesByID(this.targetJson.id);
        } else {
        // TBD - find a way to actually really only show target class, excluding siblings
            targetEntites = [$warp.model.getBaseClassByID(this.targetJson.id)];
        }

        // Prepare selection list with real and derived entities:
        var options = $("#WarpJS_assocSelectionModal_selectFromType").empty();
        targetEntites.forEach(function(entity, idx) {
            var option = $('<option></option>');
            option.text(entity.name);
            option.prop('value', idx);
            option.data('type', entity.name);
            if (idx === 0) {
                option.prop('selected', 'selected');
            }
            options.append(option);
        });
        options.data('parent', this);
        options.change(function() {
            var parent = $(this).data('parent');
            var type = $(this).find(':selected').data('type');
            parent.updateSelectionTargets(type, function() {});
        });

        // Relationship proxy for selection targets:
        this.assocProxy = this.sourceEntityProxy.getRelationshipProxy(this.relnJson.id);
        this.assocProxy.entitiesPerPage = this.maxAssocs;

        // Table view for target
        var tv = $warp.model.getDefaultTableView(this.targetJson);

        var tableConfig = {
            relationshipProxy: this.assocProxy.getAssocTargetsProxy(),
            globalID: this.globalID() + "_selectionTable",
            callbackRowSelected: function() {
                this.context.addSelection(this.id, this.type);
            },
            callbackAdd: null,
            callbackContext: this,
            tableViewJson: tv
        };

        // The "ok" Button to close the modal
        $('#selectEntityM_closeB').on('click', function() {
            this.updateAssocWithDataFromEditor(function() {
                this.warpWidget.updateViewWithDataFromModel(function() {
                    $('#associationEditorM').modal('hide');
                });
            }.bind(this));
        }.bind(this));

        this.entitySelectionTable = new WarpTable(tableConfig);
        var selectFromTable = $("#WarpJS_assocSelectionModal_selectFromTable").empty();
        this.entitySelectionTable.createViews(selectFromTable, function() {
            this.entitySelectionTable.updateViewWithDataFromModel(function() {
                this.updateSelectionTargets(targetEntites[0].name, function() {
                    this.updateSelections();
                    $("#associationEditorM").modal();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    globalID() {
        return this._globalID;
    }

    updateSelectionTargets(newType, callback) {
        this.assocProxy.getAssocTargetsProxy().setTargetType(newType);
        this.entitySelectionTable.updateViewWithDataFromModel(callback);
    }

    updateSelections() {
        var label = $('<li class="disabled"><a href="#">Selection:</a></li>');
        var ul = $('<ul class="nav nav-pills" id="warpAssocEditor_selections"></ul>');
        ul.append(label);
        $("#WarpJS_assocSelectionModal_selectionList").empty().append(ul);
        this.assocProxy.useRelationship(function(assocProxy) {
            var resultCount = assocProxy.noOfResultsOnCurrentPage();
            if (resultCount === 0) {
                $('#WarpJS_assocSelectionModal_selectionDetails').hide();
            } else {
                for (var idx = 0; idx < resultCount; idx++) {
                    assocProxy.queryResult(idx).useData(function(proxy) {
                        var name = proxy.displayName();
                        var targetID = proxy.data._id;
                        // var desc = assocProxy.getAssocDataByTargetID(targetID).desc;
                        var li = $('<li><a href="#">' + name + '</a></li>');
                        if (idx === 0) {
                            li.prop('class', 'active');
                        }
                        li.data('context', { targetID: targetID, targetName: name, assocEditor: this });
                        li.on('click', function() {
                            var context = $(this).data('context');
                            context.assocEditor.updateAssocDetailEditor(context.targetID, context.targetName, this);
                        });
                        ul.append(li);
                    }.bind(this));
                }

                // TBD - Potential race Condition? Must do this last, since this might change the assocProxy!!!
                assocProxy.queryResult(0).useData(function(proxy) {
                    var name = proxy.displayName();
                    var targetID = proxy.data._id;
                    this.updateAssocDetailEditor(targetID, name);
                }.bind(this));
            }
        }.bind(this));
    }

    updateAssocDetailEditor(id, name, selection) {
    // Change selected pill
        $(selection).prop('class', 'active');
        $(selection).siblings().prop('class', '');

        // Save currently active values
        this.updateAssocWithDataFromEditor(function() {
            var edit = $('#WarpJS_assocSelectionModal_selectionDetails');

            // Remember new oid as 'active'
            edit.data('oid', id);

            var fg = $('<div class="form-group"></div>');
            var lbl = $('<label for="comment">Description for selection \'' + name + '\':</label>');
            var txt = $('<textarea class="form-control" rows="3" id="WarpJS_assocSelectionModal_selectionDetails_input"></textarea>');
            var btnGrp = $('<div class="btn-group-sm" role="group" aria-label="Basic example" style="margin-top: 5px;">');

            var desc = this.assocProxy.getAssocDataByTargetID(id).desc;
            txt.val(desc);

            var buttonRemove = $('<button type="button" class="btn btn-secondary">Remove from Selection</button>');
            buttonRemove.on('click', function() {
                this.context.removeFromSelection(this.id);
            }.bind({ context: this, id: id }));

            btnGrp.append(buttonRemove);
            fg.append(lbl).append(txt).append(btnGrp);

            edit.empty().append(fg);
            $('#WarpJS_assocSelectionModal_selectionDetails').show();
        }.bind(this));
    }

    updateAssocWithDataFromEditor(callback) {
        var oid = $('#WarpJS_assocSelectionModal_selectionDetails').data('oid');
        if (oid && oid !== "") {
            this.assocProxy.useRelationship(function(assocProxy) {
                var desc = $('#WarpJS_assocSelectionModal_selectionDetails_input').val();
                try {
                    assocProxy.updateAssocDesc(oid, desc);
                } catch (err) {
                    warpjsUtils.trace(1, "WarpAssociationEditor.updateAssocWithDataFromEditor", "Can't update assocData - assoc was probably removed before");
                }
                callback();
            });
        } else {
            callback();
        }
    }

    addSelection(id, type) {
        this.assocProxy.useRelationship(function(assocProxy) {
            if (assocProxy.noOfTotalQueryResults() >= this.maxAssocs) {
                $warp.alert("Reached max no. of associations currently supported: " + this.maxAssocs);
                return;
            }
            this.assocProxy.addToAssocTargets(id, type);
            this.updateSelections();
        }.bind(this));
    }

    removeFromSelection(id) {
        this.assocProxy.useRelationship(function(assocProxy) {
            this.assocProxy.removeFromAssocTargets(id);
            this.updateSelections();
        }.bind(this));
    }
}

module.exports = WarpAssociationEditor;
