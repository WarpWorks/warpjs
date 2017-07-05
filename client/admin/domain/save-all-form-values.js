const saveAggregationFormValues = require('./save-aggregation-form-values');
const saveAssociationFormValues = require('./save-association-form-values');
const saveEntityFormValues = require('./save-entity-form-values');
const saveEnumFormValues = require('./save-enum-form-values');
const savePropertyFormValues = require('./save-property-form-values');

module.exports = () => {
    saveEntityFormValues();
    savePropertyFormValues();
    saveEnumFormValues();
    saveAggregationFormValues();
    saveAssociationFormValues();
};
