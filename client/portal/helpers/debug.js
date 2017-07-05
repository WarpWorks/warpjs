/* eslint-disable no-console */
module.exports = function debug(value) {
    console.log("[DEBUG] ==================================================");
    console.log("        == Context (this)                               ==");
    console.log("        == -------------------------------------------- ==");
    console.log("        ==", this);

    // Ignore the helper's name (as first argument)
    if (arguments.length > 1) {
        console.log("        == -------------------------------------------- ==");
        console.log("        == Values                                       ==");
        console.log("        == -------------------------------------------- ==");
        console.log("        ==", arguments[1]);
    }
    console.log("[DEBUG] ==================================================");
};
