const EntityProxy = require('./entity-proxy');
const WarpBreadcrumb = require('./breadcrumb');
const WarpModelParser = require('./model-parser');
const WarpPageView = require('./page-view');
const utils = require('./../utils');
const WarpWidget = require('./widget');

function getDomainFromURL() {
    var path = window.location.pathname;
    const elems = path.split("/");
    return elems.length > 2 ? elems[elems.length - 2] : null;
}

function getEntityTypeFromURL() {
    var path = window.location.pathname;
    const elems = path.split("/");
    return elems.length > 1 ? elems[elems.length - 1] : null;
}
function getURLParam(argName) {
    var urlSearch = window.location.search;
    var arg = urlSearch.split(argName + "=");
    if (arg.length < 2) {
        return null;
    }
    return arg[1].split("&")[0];
}

class WarpJSClient extends WarpWidget {
    constructor() {
        super(null, { localID: "WarpJS" });
        this.entityCache = [];
        this.toplevelEntityIsRootInstance = false;

        this.pageView = null;
        this.breadcrumb = null;
        this.model = null;
    }

    getPageView() {
        return this.pageView;
    }

    openInNewPage(oid, type) {
        var url = this.links.domain.href + "/" + type + '?oid=' + oid;
        window.location.href = url;
    }

    entityCacheGetEntityByID(id) {
        var res = null;
        this.entityCache.forEach((entityProxy) => {
            if (entityProxy.data && entityProxy.data._id === id) {
                utils.trace(1, "WarpJSClient.entityCacheGetEntityByID", "Found entity in cache: " + id);
                res = entityProxy;
            }
        });
        return res;
    }

    entityCacheFindOrAddNewEntityProxy(entityConfig) {
        var p;

        if (entityConfig.oid) {
            p = this.entityCacheGetEntityByID(entityConfig.oid);
            if (p) {
                return p;
            }
        }
        if (entityConfig.data) {
            p = this.entityCacheGetEntityByID(entityConfig.data._id);
            if (p) {
                return p;
            }
        }
        return new EntityProxy(entityConfig);
    }

    entityCacheAdd(ep) {
        if (ep.data && this.entityCacheGetEntityByID(ep.data._id)) {
            throw new Error("Entity Cache: Can not add proxy with same ID twice (" + ep.toString() + ")");
        }
        this.entityCache.push(ep);
    }

    entityCacheGetDocuments(type) {
        var docs = [];
        this.entityCache.forEach(function(ep) {
            if (type) {
                if (ep.isDocument && ep.type === type) {
                    docs.push(ep);
                }
            } else {
                if (ep.isDocument) {
                    docs.push(ep);
                }
            }
        });
        return docs;
    }

    updateViewWithDataFromModel(callback) {
        this.breadcrumb.updateViewWithDataFromModel(function() {
            this.pageView.updateViewWithDataFromModel(callback);
        }.bind(this));
    }

    updateModelWithDataFromView(callback) {
        this.pageView.updateModelWithDataFromView(callback);
    }

    addBreadcrumb(config) {
        this.breadcrumb = new WarpBreadcrumb(this, config);
        return this.breadcrumb;
    }

    progressBarOn(percent) {
        if (!this.progressBarModal) {
            var modal = $('<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;"></div>');
            var modalDialog = $('<div class="modal-dialog modal-m"></div>');
            var modalContent = $('<div class="modal-content"></div>');
            var modalHeader = $('<div class="modal-header"><h3 style="margin:0;">Loading</h3></div>');
            var modalBody = $('<div class="modal-body"></div>');
            var progress = $('<div class="progress progress-striped active" style="margin-bottom:0;"></div>');
            var progressBar = $('<div class="progress-bar" aria-valuemin="0" aria-valuemax="100"></div>');

            modal.append(modalDialog);
            modalDialog.append(modalContent);
            modalContent.append(modalHeader);
            modalContent.append(modalBody);
            modalBody.append(progress);
            progress.append(progressBar);

            this.progressBar = progressBar;
            this.progressBarModal = modal;
        }
        this.progressBar.prop('aria-valuenow', "" + percent);
        this.progressBar.prop('style', "width:" + percent + "%");
        this.progressBarModal.modal('show');
    }

    progressBarOff() {
        this.progressBarModal.modal('hide');
    }

    alert(msg) {
        this.createModal("Warning", msg, "danger",
            [{ label: "OK",
                callback: function() {
                    $("#genericModalM").modal("hide");
                }}]);
    }

    createModal(title, message, messageType, actions) {
        var mType = messageType || "info"; // Can be "success", "info", "warning" or "danger"
        $("#genericModalMessageD").prop('class', 'alert alert-' + mType);

        $("#genericModalTitleH").text(title);
        $("#genericModalMessageD").html(message);

        $("#genericModalButtonsD").empty();
        if (!actions) {
            $("#genericModalButtonsD").html("<button type='button' class='btn btn-default' data-dismiss='modal'>OK</button>");
        } else {
            actions.forEach(function(action) {
                var dismiss = action.close ? "data-dismiss='modal'" : "";
                var button = $("<button type='button' class='btn btn-default' " + dismiss + ">" + action.label + "</button>");
                button.on("click", action.callback);
                $("#genericModalButtonsD").append(button);
            });
        }
        $("#genericModalM").modal();
    }

    createViews(parentHtml, callback) {
        var container = null;
        if ($("#" + this.globalID()).length) {
            container = $("#" + this.globalID());
        } else {
            container = $('<div class="container" role="main"></div>');
            container.prop('id', this.globalID());
        }
        container.empty();

        var row = $('<div class="row"></div>');
        var col = $('<div class="col-sm-12"></div>');

        this.breadcrumb.createViews(col, function() {
            this.pageView.createViews(col, function() {
                container.append(row);
                row.append(col);
                parentHtml.append(container);
                callback();
            });
        }.bind(this));
    }

    save(ignoreReloadForNewEntities) {
        utils.trace(1, "--------------- View Hierarchy ---------------");
        utils.trace(1, this.pageView.toString());
        utils.trace(1, "--------------- -------------- ---------------");

        this.pageView.updateModelWithDataFromView(() => {
            utils.trace(1, "--------------- View Hierarchy ---------------");
            utils.trace(1, this.pageView.toString());
            utils.trace(1, "--------------- -------------- ---------------");

            utils.trace(1, ">>> WarpJSClient.save()");
            this.entityCache.forEach((entityProxy) => {
                if (entityProxy.isDirty) {
                    if (!entityProxy.data) {
                        throw new Error("Can not save 'dirty' entity without data!");
                    }
                    if (entityProxy.isDocument) {
                        utils.trace(
                            1, "* Document\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty +
                        "\n    - Changes: " + entityProxy.historyToString());
                        utils.trace(1, "JSON:");
                        var jsonData = JSON.stringify(entityProxy.data, null, 2);
                        utils.trace(1, jsonData);
                    } else {
                        utils.trace(1, "* Embedded Entity\n    - Child of:" + entityProxy.getDocumentProxy().displayName() + "\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty);
                        utils.trace(1, "- Changes: " + entityProxy.historyToString());
                    }
                }
            });
            utils.trace(1, "<<< WarpJSClient.save()");

            this.entityCache.forEach(function(entityProxy) {
                try {
                    entityProxy.save(ignoreReloadForNewEntities);
                } catch (err) {
                    this.alert("Error saving entity: " + err);
                }
            });
        });
    }

    initialize(jsonData, pageConfig, callback) {
        // Get Type + Domain
        this.domain = getDomainFromURL();
        // $("#warpjsNavbarName").text(this.domain);
        pageConfig.entityType = getEntityTypeFromURL();

        var entityConfig = {
            type: pageConfig.entityType,
            isDocument: true // Toplevel Entity on a page is always a document
        };

        // Handle URL Arguments: editEntity || addEntity || rootInstance
        var oid = getURLParam("oid");
        var urlHasArgs = window.location.search.split('?').length !== 1;
        if (!urlHasArgs) {
            if (pageConfig.entityType !== this.domain) {
                this.alert("Can not load root instance: '" + pageConfig.entityType + "' from URL is not the required root instance type!");
            }
            this.toplevelEntityIsRootInstance = true;
            entityConfig.mode = "rootInstance";
        } else if (oid) {
            entityConfig.mode = "editEntity";
            entityConfig.oid = oid;
        } else {
            entityConfig.mode = "addNewEntity";
            entityConfig.parentID = getURLParam("parentID");
            entityConfig.relnID = getURLParam("relnID");
            entityConfig.relnName = getURLParam("relnName");
            entityConfig.parentBaseClassName = getURLParam("parentBaseClassName");
            entityConfig.parentBaseClassID = getURLParam("parentBaseClassID");
            if (!entityConfig.parentID || !entityConfig.relnID || !entityConfig.relnName || !entityConfig.parentBaseClassName || !entityConfig.parentBaseClassID) {
                this.alert("Invalid URL!");
            }
        }

        // Create toplevel EntityProxy
        var entity = new EntityProxy(entityConfig);

        // Get page view
        this.model = new WarpModelParser(jsonData);
        var entityDefn = this.model.getEntityByName(pageConfig.entityType);
        if (!entityDefn) {
            this.alert("Invalid entity type in URL: " + pageConfig.entityType);
            throw new Error("Can't find entity:" + pageConfig.entityType);
        }
        var defaultView = this.model.getPageView(entityDefn, pageConfig.viewName);
        defaultView.entityType = pageConfig.entityType;

        // Build WarpViews
        defaultView.localID = "mainPV";
        defaultView.style = "tabs";

        // Create top-most PageView
        this.pageView = new WarpPageView(this, defaultView);
        this.pageView.setEntityProxy(entity);
        this.pageView.isToplevelPageView = true;

        // Add a breadcrumb
        this.addBreadcrumb({localID: "breadcrumb"});

        // Pre-load data for entities...
        this.pageView.initialize(() => {
        // Create HTML views
            var htmlParent = $("#" + pageConfig.htmlElements.rootElem);
            this.createViews(htmlParent, () => {
                // Add HTML Bindings
                $("#" + pageConfig.htmlElements.saveButton).on("click", this.save.bind(this, false));

                // And finally: populate the views...
                this.updateViewWithDataFromModel(() => {
                    utils.trace(1, "--------------- View Hierarchy ---------------");
                    utils.trace(1, this.pageView.toString());
                    utils.trace(1, "--------------- -------------- ---------------");

                    this.progressBarOn(100);
                    this.progressBarOff();

                    if (callback) {
                        callback();
                    }
                });
            });
        });
    }

    processCRUDcommands(commandList, handleResult) {
        // Create JSON Data
        var reqData = JSON.stringify(commandList, null, 2);

        // Post to server
        $.ajax({
            url: this.links.crud.href,
            type: 'POST',
            data: reqData,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: (result) => {
                if (result.success) {
                    handleResult(result);
                } else {
                    utils.trace(1, "WarpJSClient.processCRUDcommands():\n-  Failed to post CRUD commands - " + result.error);
                }
            },
            error: () => {
                utils.trace(1, "WarpJSClient.processCRUDcommands():\n-  Error while posting CRUD commands!");
            }
        });
    }
}

module.exports = WarpJSClient;
