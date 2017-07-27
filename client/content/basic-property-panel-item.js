const tinyMCE = require('tinymce');
const warpjsUtils = require('@warp-works/warpjs-utils');

const WarpPanelItem = require('./panel-item');

class WarpBasicPropertyPanelItem extends WarpPanelItem {
    constructor(parent, config) {
        super(parent, "BasicProperty", config);
        var propertyID = config.basicProperty[0];
        var property = $warp.model.getPropertyByID(propertyID);
        this.propertyName = property.name;
        this.propertyType = property.propertyType;
        this.example = property.examples;
    }

    updateViewWithDataFromModel(callback) {
        var ep = this.getPageView().getEntityProxy();
        ep.useData(function(entity) {
            if (entity) {
                var input = $("#" + this.globalID());
                input.val(entity.getValue(this.propertyName));
            } else {
                warpjsUtils.trace(2, "WarpBasicPropertyPanelItem.updateViewWithDataFromModel():\n-  Warning - could not get data from model for BasicPropertyPanelItem, ID=" + this.globalID());
            }
            callback();
        }.bind(this));
    }

    updateModelWithDataFromView(callback) {
        var ep = this.getPageView().getEntityProxy();

        ep.useData(function(entity) {
            if (entity.data) {
                var input = $("#" + this.globalID());

                entity.setValue(this.propertyName, input.val());
            } else {
                warpjsUtils.trace(1, "WarpBasicPropertyPanelItem.updateModelWithDataFromView():\n-  Warning - could not update " + this.propertyName + "=" + entity[this.propertyName]);
            }
            callback();
        }.bind(this));
    }

    fetchLinkSelectionModalData() {
        var contentEntity = $warp.model.model.entities.filter((object) => object.name === "Content");

        return $warp.model.model.entities.filter(
            (object) => (object.parentClass.length && object.parentClass[0] === contentEntity[0].id)
        );
    }

    fetchEntitySelectionDocuments(type, updateSelectionTableView) {
        var cmdList = {
            commandList: [
                {
                    domain: $warp.domain,
                    targetType: "Content",
                    command: "FetchListOfContentChildrenEntities",
                    filter: type
                }
            ]
        };
        $warp.processCRUDcommands(cmdList, updateSelectionTableView.bind(this));
    }

    updateSelectionTable(documents) {
        var listItems = $("#link-selection-modal-table").empty();
        var ul = $('<ul class="list-group"></ul>');

        if (documents.success) {
            documents.resultList[0].queryResult.forEach((doc) => {
                var listItem = $('<li class="list-group-item"></li>');
                listItem.text(doc.Name);
                listItem.data("name", doc.Name);
                listItem.data("id", doc._id);
                listItem.data("type", doc.type);
                listItem.on("click", this.addToSelectedLinks);
                ul.append(listItem);
            });

            if (!ul.children().get().length) {
                ul.append($('<li class="list-group-item">No Documents For This Collection</li>'));
            }

            listItems.append(ul);
        }
    }

    addToSelectedLinks(event) {
        var name = $(event.currentTarget).data("name");
        var type = $(event.currentTarget).data("type");
        var id = $(event.currentTarget).data("id");
        var addedLink = '{{' + name + ',' + type + ',' + id + '}}';

        $('.link-selection-added-links').append('<li class="pending-selection-link list-group-item">' + addedLink + '</li>');
    }

    removeLinkFromList(event) {
        $(event.currentTarget).remove();
    }

    addLinksToContentAndCloseSelectionModal() {
        var arrayOfLinks = $('.link-selection-added-links').children().get();

        arrayOfLinks.map((linkElement) => {
            var link = $(linkElement).text();

            tinyMCE.activeEditor.execCommand('mceInsertContent', false, link);
        });

        this.closeLinkSelectionModal();
    }

    closeLinkSelectionModal() {
        $("#link-selection-modal-selector").empty();
        $("#link-selection-modal-table").empty();
        $('.link-selection-added-links').empty();
        $('#link-selection-modal').modal("hide");
    }

    showLinkSelectionModal() {
        var listOfEntities = this.fetchLinkSelectionModalData();
        var options = $("#link-selection-modal-selector").empty();
        var defaultOption = $('<option></option>');

        defaultOption.text('--Select Entity--');
        defaultOption.prop('selected', 'selected');

        options.append(defaultOption);

        listOfEntities.forEach(function(entity, idx) {
            var option = $('<option></option>');
            option.text(entity.name);
            option.prop('value', idx);
            option.data('type', entity.name);

            options.append(option);
        });
        options.data('parent', this);
        options.change(function() {
            var parent = $(this).data('parent');
            var type = $(this).find(':selected').data('type');

            parent.fetchEntitySelectionDocuments(type, parent.updateSelectionTable);
        });

        $('#link-selection-modal').modal({backdrop: 'static', keyboard: false});
        $('#link-selection-modal').modal("show");
    }

    createTinyMCE(entityID) {
        if (tinyMCE.editors.length === 0) {
            var basicPropertyContext = this;

            $('#content-modal .modal-body').html('<textarea name="content-' + entityID + '" class="content-tinymce" id="content-' + entityID + '"></textarea>');
            $('.link-selection-added-links').on("click", '.pending-selection-link', this.removeLinkFromList);
            $('#link-selection-add').on("click", this.addLinksToContentAndCloseSelectionModal.bind(this));
            $('.link-selection-close').on("click", this.closeLinkSelectionModal);

            tinyMCE.init({
                selector: '.content-tinymce',
                height: 200,
                menubar: false,
                elementpath: false,
                anchor_top: false,
                anchor_bottom: false,
                force_br_newlines: false,
                force_p_newlines: false,
                forced_root_block: '',
                paste_as_text: true,
                extended_valid_elements: 'span[!class]',
                plugins: "lists link paste",
                toolbar: 'bold italic numlist bullist link linkbutton',
                setup: function(editor) {
                    editor.addButton('linkbutton', {
                        text: 'Custom Link',
                        icon: false,
                        onclick: function() {
                            basicPropertyContext.showLinkSelectionModal();
                        }
                    });
                },
                content_css: '//www.tinymce.com/css/codepen.min.css'
            });
        }
    }

    saveTinyMCEContent(entityID) {
        var editorContent = tinyMCE.activeEditor.getContent();
        $('#' + entityID).val(editorContent);

        $warp.save();

        $('.container #content-modal').modal("hide");
    }

    showContentModal(entityID) {
        tinyMCE.activeEditor.setContent($('#' + entityID).val());
        $("#content-editor-save").unbind();
        $("#content-editor-save").on("click", this.saveTinyMCEContent.bind(this, entityID));
        $('#content-modal').modal("show");
        $('#link-selection-modal').modal("show");
        $('#link-selection-modal').modal("hide");
    }

    createViews(parentHtml, callback) {
        var formGroup = $('<div class="form-group"></div>');
        var label = $('<label></label>');
        label.prop('for', this.globalID());
        label.prop('class', 'col-sm-2 control-label');
        label.text(this.label);

        var inputDiv = $('<div></div>');
        inputDiv.prop('class', 'col-sm-10');

        var input = $('<input></input>');
        input.prop('type', 'text');
        input.prop('class', 'form-control');
        input.prop('id', this.globalID());
        inputDiv.append(input);

        if (this.propertyType === "text") {
            input.prop("readonly", true);
            var button = $('<button style="float: right;"><span class="glyphicon glyphicon-list-alt"></span></button>');
            button.prop('type', 'button');
            button.prop('class', 'btn btn-link');
            button.on('click', this.showContentModal.bind(this, this.globalID()));

            inputDiv.append(button);
            this.createTinyMCE(this.globalID());
        }

        formGroup.append(label);
        formGroup.append(inputDiv);

        parentHtml.append(formGroup);
        callback();
    }
}

module.exports = WarpBasicPropertyPanelItem;
