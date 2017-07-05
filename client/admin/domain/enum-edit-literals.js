const updateEnumEditLiteralsTable = require('./update-enum-edit-literals-table');

module.exports = () => {
    updateEnumEditLiteralsTable();
    $("#enumEditLiteralsM").modal();
};
