const warpGlobals = require('./../warp-globals');

module.exports = () => {
    for (var i in warpGlobals.$active.enumeration.literals) {
        var literal = warpGlobals.$active.enumeration.literals[i];
        literal.name = $("#" + literal.id + "_name").val();
        literal.desc = $("#" + literal.id + "_desc").val();
        literal.pos = $("#" + literal.id + "_pos").val();
        literal.icon = $("#" + literal.id + "_icon").val();
    }
    $("#enumLiteralsI").val(warpGlobals.$active.enumeration.toString());
};
