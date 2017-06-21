const WarpPanelItem = require('./panel-item');

class WarpEnumPanelItem extends WarpPanelItem {
    constructor(parent, config) {
        super(parent, "Enum", config);
        this.propertyName = config.name;
        this.validEnumSelections = config.validEnumSelections;

        var eID = config.enumeration[0];
        var e = this.getWarpJSClient().model.getEnumByID(eID);
        this.literals = e ? e.literals : [];
    }

    updateViewWithDataFromModel(callback) {
        callback();
    }

    updateModelWithDataFromView(callback) {
        var select = $("#" + this.globalID());
        var selection = select.find(':selected').data('literal');
        if (selection !== 'WarpJS_Enum_noSelection') {
            this.getPageView().getEntityProxy().useData(function(entity) {
                entity.setValue(this.propertyName, selection);
                callback();
            }.bind(this));
        } else {
            callback();
        }
    }

    createViews(parentHtml, callback) {
        this.getPageView().getEntityProxy().useData(function(entity) {
            var selected = entity.getValue(this.propertyName);
            var formGroup = $('<div class="form-group"></div>');

            var label = $('<label></label>');
            label.prop('for', this.globalID());
            label.prop('class', 'col-sm-2 control-label');
            label.text(this.label);

            var selectDiv = $('<div></div>');
            selectDiv.prop('class', 'col-sm-10');

            var select = $('<select></select>');
            select.prop('class', 'form-control');
            select.prop('id', this.globalID());

            // No selection:
            var noOption = $('<option></option>');
            noOption.text('-----------');
            noOption.data('literal', 'WarpJS_Enum_noSelection');
            if (!selected) {
                noOption.prop('selected', 'selected');
            }
            select.append(noOption);

            if (this.literals) {
                this.literals.forEach(function(literal) {
                    var option = $('<option></option>');
                    option.text(literal.name);
                    option.data('literal', literal.name);
                    if (selected === literal.name) {
                        option.prop('selected', 'selected');
                    }
                    select.append(option);
                });
            }

            formGroup.append(label);
            formGroup.append(selectDiv);
            selectDiv.append(select);

            parentHtml.append(formGroup);
            callback();
        }.bind(this));
    }
}

module.exports = WarpEnumPanelItem;
