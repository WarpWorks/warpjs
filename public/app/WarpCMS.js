var activeEntityProxy = null;
var activeImageMapReln = null;
var imageMapRelnID = 9;

function warpCMS_info(message) {
    $('#warpCMS_alertInfoD').append("- " + message + "<br>");
}

function warpCMS_editImageMap(context) {
    context.entityProxy.useData(function (entityProxy) {
        activeEntityProxy = entityProxy;
        var rp = activeEntityProxy.getRelationshipProxy(imageMapRelnID);
        rp.useRelationship(function (relnProxy) {
            activeImageMapReln = relnProxy;

            var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>');
            var modalDialog = $('<div class="modal-dialog" style="width: 95%;"></div>');
            var modalContent = $('<div class="modal-content"></div>');
            var modalHeader = $('<div class="modal-header"></div>');
            var btnClose = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
            var modalTitle = $('<h4 class="modal-title">ImageMap Editor</h4>');
            var modalBody = $('<div class="modal-body" id="WarpCMS_EditImageMap"></div>');
            var modalFooter = $('<div class="modal-footer"></div>');
            var alertInfo = $('<div class="alert alert-info" id="warpCMS_alertInfoD"></div>');
            var btnSave = $('<button type="button" class="btn btn-default" data-dismiss="modal">Save <span class="glyphicon glyphicon-ok"></span></button>');
            var btnCancel = $('<button type="button" class="btn btn-default" data-dismiss="modal">Cancel <span class="glyphicon glyphicon-remove"></span></button>');
            // TBD: var btnBack = $('<button type="button" class="btn btn-default">Undo <span class="glyphicon glyphicon-step-backward"></span></button>');

            modalFooter.append(btnSave).append(btnCancel);
            modalHeader.append(btnClose).append(modalTitle);
            modalContent.append(modalHeader);
            modalContent.append(modalBody);
            modalContent.append(modalFooter);
            modalDialog.append(modalContent);
            modal.append(modalDialog);

            if (!SVG.supported) {
                $warp.alert("Can not open ImageEditor: This browser does not support SVG!");
                return;
            }

            // Modal has to be linked to the main DOM:
            $('#WarpJS_DOM_anchor_for_modals').empty().append(modal);

            // Need to get the natural width/height of image first; hence the following hack...
            var img = new Image();
            img.onload = function () {
                var naturalWidth = this.width;
                var naturalHeight = this.height;

                var draw = SVG('WarpCMS_EditImageMap');
                $('#WarpCMS_EditImageMap').append(alertInfo);

                // Re-creating the image because I currently don`t know a better way...
                var image = draw.image(activeEntityProxy.data.ImageURL).move(0, 0);

                // "Stretch" the image
                image.attr('preserveAspectRatio', 'none');

                var newHeight = -1;
                var newWidth = -1;
                var h = parseInt(activeEntityProxy.data.Height + "");
                var w = parseInt(activeEntityProxy.data.Width + "");
                var hasHeight = h > 0;
                var hasWidth = w > 0;

                if (hasHeight && hasWidth) {
                    newHeight = h;
                    newWidth = w;
                }
                else if (hasHeight) {
                    newHeight = h;
                    newWidth = h * (naturalWidth / naturalHeight);
                }
                else if (hasWidth) {
                    newWidth = w;
                    newHeight = w * (naturalHeight / naturalWidth);
                }
                else {
                    newHeight = naturalHeight;
                    newWidth = naturalWidth;
                    warpCMS_info("Warning: Width/Height not defined, using natural width/height from image!");
                }
                newHeight = Math.floor(newHeight);
                newWidth = Math.floor(newWidth);

                image.height(newHeight);
                image.width(newWidth);
                draw.size(newWidth, newHeight);
                draw.rect(newWidth, newHeight).move(0, 0).attr({style: 'fill:none;stroke-width:1;stroke:gray'});

                var imageAreas = activeImageMapReln.allQueryResults();
                imageAreas.forEach(function (imageArea) {
                    if (!imageArea.data.Coords) {
                        warpCMS_info("Warning: ImageArea without Coords!");
                    }
                    else {
                        var coordsArray = imageArea.data.Coords.split(',');
                        if (coordsArray.length !== 4) {
                            warpCMS_info("Warning: ImageArea without invalid Coords (must have exactly 4, e.g. '1,1,10,10'): " + imageArea.data.Coords);
                        }
                        else {
                            var x1 = parseInt(coordsArray[0]);
                            var y1 = parseInt(coordsArray[1]);
                            var x2 = parseInt(coordsArray[2]);
                            var y2 = parseInt(coordsArray[3]);
                            if (x1 > x2 || y1 > y2) {
                                warpCMS_info("Warning: ImageArea Coords invalid (x1>x2 or y1>y2): " + imageArea.data.Coords);
                            }
                            else if (x2 > newWidth) {
                                warpCMS_info("Warning: ImageArea x-Coord (" + x2 + ") larger than Image width (" + newWidth + ")");
                            }
                            else if (y2 > newHeight) {
                                warpCMS_info("Warning: ImageArea y-Coord (" + y2 + ") larger than Image height(" + newHeight + ")");
                            }
                            else {
                                var w = x2 - x1;
                                var h = y2 - y1;
                                draw.rect(w, h).move(x1, y1).attr({style: 'fill:none;stroke-width:1;stroke:blue'});
                            }
                        }
                    }
                });

                warpCMS_info("Click, move mouse and then click again to create new ImageArea");

                //
                // Callbacks and event handlers:
                //
                var currentElem = null;
                var newElems = [];
                draw.click(function (evt) {
                    if (!currentElem) {
                        var rect = draw.rect(5, 5).move(evt.offsetX, evt.offsetY).attr({style: 'fill:none;stroke-width:1;stroke:orange'});
                        currentElem = {
                            x1: evt.offsetX,
                            y1: evt.offsetY,
                            rect: rect
                        };
                    }
                    else {
                        if (evt.offsetX > currentElem.x1 && evt.offsetY > currentElem.y1)
                            currentElem.x2 = evt.offsetX;
                        currentElem.y2 = evt.offsetY;
                        newElems.push(currentElem);
                        currentElem = null;
                    }
                });

                draw.mousemove(function (evt) {
                    if (!currentElem) return;
                    var w = Math.max(5, evt.offsetX - currentElem.x1);
                    var h = Math.max(5, evt.offsetY - currentElem.y1);
                    currentElem.rect.height(h);
                    currentElem.rect.width(w);
                });

                btnSave.click(function () {
                    var idx = 0;
                    var createNewImageMap = function () {
                        if (idx < newElems.length) {
                            var elem = newElems[idx++];
                            newImageMap = {
                                "Coords": elem.x1 + "," + elem.y1 + "," + elem.x2 + "," + elem.y2
                            }
                            activeImageMapReln.addNewEmbeddedEntity(newImageMap, function (newIM) {
                                console.log("Added new ImageMap: " + newIM._id);
                                createNewImageMap();
                            });
                        } else {
                            activeImageMapReln.requiresUpdate = true;
                            context.warpPanel.getPageView().updateViewWithDataFromModel(function () {
                                console.log("Finally updating view!");
                            });
                        }
                    }
                    createNewImageMap();
                });

                // Create modal
                modal.modal();
            }
            img.onerror = function () {
                $warp.alert("Could not load image: " + activeEntityProxy.data.ImageURL);
            };
            img.src = activeEntityProxy.data.ImageURL;
        });
    });
}