//
// URL Handling
//
HeadStart_getURLParam = function (argName) {
    var urlSearch = window.location.search;
    var arg = urlSearch.split(argName+"=");
    if (arg.length<2) return null;
    return arg[1].split("&")[0];
}

//
// Class "EntityTable"
//
function EntityTable (id, prefix, columns, subtypes, relationship) {
    this.id=id;
    this.table=prefix+"_table";
    this.tableBody=prefix+"_tableBody";
    this.searchInput=prefix+"_searchInput";
    this.searchButton=prefix+"_searchButton";
    this.searchOptions=prefix+"_searchOptions";
    this.pagination=prefix+"_pagination";
    this.columns=columns;
    this.subtypes=subtypes;
    this.relationship=relationship;

    // Make this available via $active
    if ($active.entityTables[id])
        console.log("Warning: Registering EntityTable with ID "+id+" twice!");
    $active.entityTables[id]=this;
}

EntityTable.prototype.updateTable=function () {
    // Update table with entities from query result:
    $("#"+this.table).empty();
    var table = "<thead><tr><th></th>";
    for (var i in this.columns) {
        var col=this.columns[i];
        table += "<th>"+col+"</th>";
    }
    table += "</thead><tbody id="+this.tableBody+"></tbody>";
    $("#"+this.table).html(table);

    for (var i in this.relationship.queryResults) {
        var elem = this.relationship.queryResults[i];
        var TDs = "";
        for (var i in this.columns) {
            var val=elem["get_"+this.columns[i]]();
            if (typeof val === 'string')
                val = val.length<15 ? val : val.slice(0, 12)+"...";
            TDs += "<td>"+val+"</td>";
        }
        var add= "<a href='#'><span class='glyphicon glyphicon-plus'></span></a>";
        var id = this.table+"-TD:"+elem.id;
        $("#"+this.tableBody).append(
            "<tr class='"+this.table+"-row' id='"+id+"' style='cursor:pointer'>"+
            "<td>"+add+"</td>"+TDs+"</tr>");
    }
    // Fill table with empty rows, if needed
    var gap = this.relationship.entitiesPerPage - this.relationship.queryResults.length;
    for (var idx=0; idx<gap; idx++) {
        // Fill last page with empty rows
        var TDs = "";
        for (i in this.columns)
            TDs += "<td> </td>";
        $("#"+this.tableBody).append(
            "<tr><td><font color='white'>/</font></td>"+TDs+"</tr>");
    }

    // Search options
    var searchOptions = "";
    for (i in this.columns) {
        searchOptions += "<li><a href='#' class='"+this.table+"_csearch'>"+this.columns[i]+" = ...</a></li>";
    }
    if (this.subtypes.length>0)
        searchOptions += "<li class='divider'></li>";
    for (i in this.subtypes) {
        searchOptions += "<li><a href='#' class='"+this.table+"_csearch'>Type = "+this.subtypes[i]+"</a></li>";
    }
    $("#"+this.searchOptions).empty();
    $("#"+this.searchOptions).data("widgetid", this.id);
    $("#"+this.searchOptions).append(searchOptions);
    $("."+this.table+"_csearch").on("click", function () {
        var searchStr = $(this).text();
        var w = $(this).parent().parent().data("widgetid");
        w = $active.entityTables[w];
        searchStr=searchStr.replace("...", "");
        searchStr=searchStr.replace(/\s/g, '');
        var currentSearchStr = $("#"+w.searchInput).val();
        if (currentSearchStr.length>0) searchStr = currentSearchStr+" & "+searchStr;
        $("#"+w.searchInput).val(searchStr);
        $("#"+w.searchInput).focus();
    });
    $("#"+this.searchInput).data("widgetid", this.id);
    $("#"+this.searchInput).keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            var widgetID=$(this).data("widgetid");
            var entityTable=$active.entityTables[widgetID];
            entityTable.updateSearchResults();
        }
    });
    $("#"+this.searchButton).data("widgetid", this.id);
    $("#"+this.searchButton).on("click", function() {
        var widgetID=$(this).data("widgetid");
        var entityTable=$active.entityTables[widgetID];
        entityTable.updateSearchResults();
    });

    // Pagination
    var totalPages = Math.ceil(this.relationship.queryResultsCount / this.relationship.entitiesPerPage);
    $("#"+this.pagination).empty();
    for (var cnt=0; cnt<totalPages; cnt++) {
        // Add "..." if too many results
        if (cnt===this.relationship.maxNumberOfPages) {
            var pageIcon = $("<li><a href='#' title='Too many search results: found "+this.relationship.queryResultsCount+" matching elements. Please refine search query!'>...</a></li>");
            $("#"+this.pagination).append (pageIcon);
            break;
        }
        // Add numbered pagination elements
        var cls = cnt===$active.relationship.currentPage ? "class='active'" : "";
        var pageIcon = $("<li "+cls+" id='"+this.table+"_page'><a href='#'>"+cnt+"</a></li>");
        pageIcon.data("widgetid", this.id);
        pageIcon.data("page", cnt);
        $("#"+this.pagination).append (pageIcon);
        pageIcon.on("click", function () {
            var page = $(this).data("page");
            var id = $(this).data("widgetid");
            var entityTable = $active.entityTables[id];
            entityTable.relationship.currentPage = page;
            entityTable.updateRelationshipAndWidget();
        });
    }
}

EntityTable.prototype.updateSearchResults=function () {
    this.relationship.setFilter($("#"+this.searchInput).val());
    this.updateRelationshipAndWidget();
}

//
// Confirmation Dialogue: Generic Modal
//

function createModal (title, message, messageType, actions) {
    var mType = messageType ? messageType : "info";

    $("#genericModalTitleH").text (title);
    $("#genericModalMessageD").html (message);

    $("#genericModalButtonsD").empty();
    if (!actions)
        $("#genericModalButtonsD").html("<button type='button' class='btn btn-default' data-dismiss='modal'>OK</button>");
    else {
        actions.forEach(function (action) {
            var dismiss = action.close ? "data-dismiss='modal'" : "";
            var button = $("<button type='button' class='btn btn-default' "+dismiss+">"+action.label+"</button>");
            button.on("click", action.callback);
            $("#genericModalButtonsD").append(button);
        });
    }
    $("#genericModalM").modal();
}