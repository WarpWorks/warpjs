const enumSaveLiterals = require('./enum-save-literals');
const updateEnumEditLiteralsTable = require('./update-enum-edit-literals-table');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    var body = "<thead><tr><th>Name</th><th>Description</th><th>Position</th><th>Icon</th><th></th></tr></thead>";
    body += "<tbody>";
    warpGlobals.$active.enumeration.literals.forEach(function(literal) {
        var name = literal.name ? literal.name : "";
        var desc = literal.desc ? literal.desc : "";
        var pos = literal.position ? literal.position : "";
        var icon = literal.icon ? literal.icon : "";
        var id = literal.id;
        body += "<tr class='literal-row' id='" + literal.id + "'>" +
            "<td><input id='" + id + "_name' type='text' class='form-control' value='" + name + "'/></td>" +
            "<td><input id='" + id + "_desc' type='text' class='form-control' value='" + desc + "'/></td>" +
            "<td><input id='" + id + "_pos'  type='text' class='form-control' value='" + pos + "'/></td>" +
            "<td><input id='" + id + "_icon' type='text' class='form-control' value='" + icon + "'/></td>" +
            "<td><a href='#' class='enumDeleteLiteral' id='" + id + "'><span class='glyphicon glyphicon-remove'></span></a></td>" +
            "</tr>";
    });
    body += "</tbody>";
    var table = "<table class='table'>" + body + "</table>";
    var form = "<form class='form-horizontal'>" + table + "</form>";
    form += "<button type='button' id='enumAddLiteral' class='btn btn-primary'><span class='glyphicon glyphicon-plus-sign'></span> Add Literal</button> ";
    form += "<button type='button' id='enumAutoNumber' class='btn btn-primary'><span class='glyphicon glyphicon-cog'></span> Auto Number</button>";

    $("#enumEditLiterals_LiteralsT").html($(form));

    $("#saveEnumLiteralsB").on("click", enumSaveLiterals);

    $("#enumAutoNumber").on("click", function() {
        var pos = 1;
        for (var i in warpGlobals.$active.enumeration.literals) {
            warpGlobals.$active.enumeration.literals[i].position = pos++;
        }
        enumSaveLiterals();
        updateEnumEditLiteralsTable();
    });

    $(".enumDeleteLiteral").on("click", function() {
        enumSaveLiterals();
        warpGlobals.$active.enumeration.remove_Literal($(this).attr("id"));
        updateEnumEditLiteralsTable();
    });

    $("#enumAddLiteral").on("click", function() {
        enumSaveLiterals();
        var literal = warpGlobals.$active.enumeration.addNew_Literal("New");
        literal.position = warpGlobals.$active.enumeration.literals.length;
        literal.icon = "";
        updateEnumEditLiteralsTable();
    });
};
