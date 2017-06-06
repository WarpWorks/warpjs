const _ = require('lodash');
const utils = require('./../../../utils');
const modalTemplate = require('./../../templates/partials/map-area-modal.hbs');
const constants = require('./constants.js');

class HoverPreview {
    constructor() {
        this._imageAreaCache = {};
        this._resultDataCache = {};
        this._imagePartition = null;
    }

    updateModalCSS(modalX, modalY, modalFlagY, flagClassName) {
        $(constants.MAP_AREA_MODAL_CONTAINER).css({left: `${modalX}px`, top: `${modalY}px`});
        $(constants.MAP_AREA_MODAL_FLAG).css({top: `${modalFlagY}px`});
        $(constants.MAP_AREA_MODAL_FLAG).removeClass();
        $(constants.MAP_AREA_MODAL_FLAG).addClass(flagClassName);
    }

    getWidthOffset() {
        const bootstrapRowWidth = $(constants.FIGURE_CONTAINER).parent().width();
        const imgWidth = $(constants.FIGURE_CONTAINER).children().width();

        if (!$(constants.FIGURE_CONTAINER).hasClass('pull-left') && (bootstrapRowWidth - imgWidth) >= 0) {
            return (bootstrapRowWidth - imgWidth) / 2;
        }

        return 0;
    }

    generateModalPositionData(modalHeight, modalWidth, zoneName, computedCoords, bottomMiddleFlagHeight) {
        const modalPosition = {};
        const widthOffset = this.getWidthOffset();
        const marginLeft = parseInt($("#map-area-modal-container").css("margin-left"), 10);
        const marginRight = parseInt($("#map-area-modal-container").css("margin-right"), 10);
        const marginTop = parseInt($("#map-area-modal-container").css("margin-top"), 10);
        const marginBottom = parseInt($("#map-area-modal-container").css("margin-bottom"), 10);
        let adjustedModalHeight = Math.round(modalHeight / 2);
        let adjustedModalWidth = Math.round(modalWidth / 2);

        if (zoneName === "zone-left") {
            const imageCenteredPixelAdjustment = 25;
            const imagePulledLeftPixelAdjustemnt = 10;
            let adjustedWidthOffset = widthOffset > 0
                                        ? widthOffset - imageCenteredPixelAdjustment
                                        : widthOffset + imagePulledLeftPixelAdjustemnt;

            modalPosition.left = computedCoords.midX - ((computedCoords.midX - computedCoords.minX) / 4) - modalWidth - marginRight + adjustedWidthOffset;
            modalPosition.top = computedCoords.midY - (modalHeight - adjustedModalHeight);
            modalPosition.flagHeight = adjustedModalHeight;
            modalPosition.flagClass = 'modal-flag-right';
        } else if (zoneName === "zone-right") {
            modalPosition.left = computedCoords.midX + (computedCoords.maxX - computedCoords.midX) + marginLeft + widthOffset;
            modalPosition.top = computedCoords.midY - (modalHeight - adjustedModalHeight);
            modalPosition.flagHeight = adjustedModalHeight;
            modalPosition.flagClass = 'modal-flag-left';
        } else if (zoneName === "zone-top") {
            const pixelsToFixFlagToModalBottom = 20;

            modalPosition.left = computedCoords.midX - adjustedModalWidth + widthOffset;
            modalPosition.top = computedCoords.midY - (computedCoords.midY - computedCoords.minY) - modalHeight + marginBottom;
            modalPosition.flagHeight = modalHeight + pixelsToFixFlagToModalBottom;
            modalPosition.flagClass = 'modal-flag-bottom';
        } else {
            modalPosition.left = computedCoords.midX - adjustedModalWidth + widthOffset;
            modalPosition.top = computedCoords.midY + (computedCoords.maxY - computedCoords.midY) + marginTop;
            modalPosition.flagHeight = bottomMiddleFlagHeight;
            modalPosition.flagClass = 'modal-flag-top';
        }

        return modalPosition;
    }

    updateModalPosition(imageAreaReferenceKey, modalHeight, bottomMiddleFlagHeight) {
        const modalPositionData = this._imageAreaCache[imageAreaReferenceKey].modalPositionData;

        if (!modalPositionData.modalHeight) {
            const modalWidth = modalPositionData.modalWidth;
            const zoneName = modalPositionData.imageAreaZoneName;
            const computedCoords = modalPositionData.imageAreaComputedCoordinates;

            modalPositionData.modalHeight = modalHeight;
            modalPositionData.modalPosition = this.generateModalPositionData(modalHeight, modalWidth, zoneName, computedCoords, bottomMiddleFlagHeight);
        }

        const modalPosition = modalPositionData.modalPosition;

        this.updateModalCSS(modalPosition.left, modalPosition.top, modalPosition.flagHeight, modalPosition.flagClass);
    }

    showModal($, title, content, imageAreaReferenceKey) {
        const overViewData = {
            title,
            content
        };

        $(constants.MAP_AREA_MODAL_CONTAINER).html(modalTemplate(overViewData));
        $(constants.MAP_AREA_MODAL_CONTAINER).show();

        const modalHeight = $(constants.MAP_AREA_MODAL_CONTAINER).height();
        const bottomMiddleFlagHeight = $(constants.MAP_AREA_MODAL_FLAG).css('top');

        this.updateModalPosition(imageAreaReferenceKey, modalHeight, bottomMiddleFlagHeight);
    }

    extractDataAndShowModal($, resultData, imageAreaReferenceKey) {
        let overViewData = _.filter(resultData._embedded.panels, (panel) => panel.type === "Overview");

        if (overViewData[0]._embedded.overviews.length) {
            const overview = overViewData[0]._embedded.overviews[0];

            this.showModal($, overview.Heading || overview.name, overview.Content, imageAreaReferenceKey);
        }
    }

    getResults($, href, cacheReferenceKey) {
        if (this._resultDataCache[href]) {
            this._imageAreaCache[cacheReferenceKey].result = this._resultDataCache[href];
            this._imageAreaCache[cacheReferenceKey].pending = false;

            if (this._imageAreaCache[cacheReferenceKey].canShowModal) {
                this.extractDataAndShowModal($, this._resultDataCache[href], cacheReferenceKey);
            }
        } else {
            utils.getCurrentPageHAL($, href)
            .then((result) => {
                this._resultDataCache[href] = result.data;
                this._imageAreaCache[cacheReferenceKey].result = this._resultDataCache[href];
                this._imageAreaCache[cacheReferenceKey].pending = false;

                if (this._imageAreaCache[cacheReferenceKey].canShowModal) {
                    this.extractDataAndShowModal($, this._resultDataCache[href], cacheReferenceKey);
                }
            });
        }
    }

    getImageAreaZone(xCoord, yCoord) {
        let zoneName = "";

        if (xCoord < this._imagePartition['left-zone']) {
            zoneName = "zone-left";
        } else if (xCoord > this._imagePartition['right-zone']) {
            zoneName = "zone-right";
        } else if (yCoord < this._imagePartition['center-divide']) {
            zoneName = "zone-top";
        } else {
            zoneName = "zone-bottom";
        }
        return zoneName;
    }

    getCoords(array, isY) {
        return array.filter((value, index) => isY === Boolean(index % 2));
    }

    getXCoords(array) {
        return this.getCoords(array, false);
    }
    getYCoords(array) {
        return this.getCoords(array, true);
    }

    getImageMapCenterCoordinates(shape, formatedCoordinateArray) {
        let lowerBoundX = 0;
        let upperBoundX = 0;
        let lowerBoundY = 0;
        let upperBoundY = 0;
        let midX = 0;
        let midY = 0;

        if (shape === "circle") {
            lowerBoundX = formatedCoordinateArray[0] - formatedCoordinateArray[2];
            upperBoundX = formatedCoordinateArray[0] + formatedCoordinateArray[2];
            lowerBoundY = formatedCoordinateArray[1] - formatedCoordinateArray[2];
            upperBoundY = formatedCoordinateArray[1] + formatedCoordinateArray[2];
            midX = formatedCoordinateArray[0];
            midY = formatedCoordinateArray[1];
        } else if (shape === "poly") {
            const xValues = this.getXCoords(formatedCoordinateArray).sort((a, b) => a - b);
            const yValues = this.getYCoords(formatedCoordinateArray).sort((a, b) => a - b);

            lowerBoundX = xValues[0];
            upperBoundX = xValues[xValues.length - 1];
            lowerBoundY = yValues[0];
            upperBoundY = yValues[yValues.length - 1];
            midX = Math.round((lowerBoundX + upperBoundX) / 2);
            midY = Math.round((lowerBoundY + upperBoundY) / 2);
        } else {
            lowerBoundX = formatedCoordinateArray[0];
            upperBoundX = formatedCoordinateArray[2];
            lowerBoundY = formatedCoordinateArray[1];
            upperBoundY = formatedCoordinateArray[3];
            midX = Math.round((lowerBoundX + upperBoundX) / 2);
            midY = Math.round((lowerBoundY + upperBoundY) / 2);
        }

        return {
            midX: midX,
            midY: midY,
            minX: lowerBoundX,
            maxX: upperBoundX,
            minY: lowerBoundY,
            maxY: upperBoundY
        };
    }

    getFormattedCoordinateList(coordinateList) {
        return _.reduce(coordinateList.split(","), (memo, value) => {
            memo.push(parseInt(value, 10));
            return memo;
        }, []);
    }

    createImageAreaCacheObject(modalWidth, areaShape, imageAreaCoordinates) {
        const formattedCoordinates = this.getFormattedCoordinateList(imageAreaCoordinates);
        const computedCoordinates = this.getImageMapCenterCoordinates(areaShape, formattedCoordinates);
        const zoneName = this.getImageAreaZone(computedCoordinates.midX, computedCoordinates.midY);
        const modalPositionObject = {};

        return {
            pending: true,
            canShowModal: true,
            result: null,
            modalPositionData: {
                imageAreaShape: areaShape,
                imageAreaCoordinates: formattedCoordinates,
                imageAreaComputedCoordinates: computedCoordinates,
                imageAreaZoneName: zoneName,
                modalHeight: null,
                modalWidth: modalWidth,
                modalPosition: modalPositionObject
            }
        };
    }

    generateImageZone(width, height) {
        const zoneRightXCoord = width - Math.floor(width / 3);
        const zoneLeftXCoord = width - (2 * Math.floor(width / 3));
        const zoneMiddleDivideY = height - (Math.round(height / 2));

        this._imagePartition = {
            'left-zone': zoneLeftXCoord,
            'right-zone': zoneRightXCoord,
            'center-divide': zoneMiddleDivideY
        };
    }

    onFocus($, event) {
        if (!this._imagePartition) {
            const imgHeight = Math.round($(constants.FIGURE_CONTAINER).children().height());
            const imgWidth = Math.round($(constants.FIGURE_CONTAINER).children().width());

            this.generateImageZone(imgWidth, imgHeight);
        }

        const href = $(event.currentTarget).data('targetHref');
        const imageAreaShape = $(event.currentTarget).attr('shape');
        const coords = $(event.currentTarget).attr('coords');
        const modalWidth = parseInt($(constants.MAP_AREA_MODAL_CONTAINER).css('width').split('px'), 10);
        const referenceKey = `${href}+${coords}`;
        const cachedImageArea = this._imageAreaCache[referenceKey];

        if (href) {
            if (cachedImageArea) {
                cachedImageArea.canShowModal = true;

                if (!cachedImageArea.pending) {
                    this.extractDataAndShowModal($, cachedImageArea.result, referenceKey);
                }
            } else {
                this._imageAreaCache[referenceKey] = this.createImageAreaCacheObject(modalWidth, imageAreaShape, coords);
                this.getResults($, href, referenceKey);
            }
        } else {
            if (!cachedImageArea) {
                this._imageAreaCache[referenceKey] = this.createImageAreaCacheObject(modalWidth, imageAreaShape, coords);
            }
            this.showModal($, $(event.currentTarget).data('previewTitle'), null, referenceKey);
        }
    }

    onBlur($, event) {
        const href = $(event.currentTarget).data('targetHref');
        const coords = $(event.currentTarget).attr('coords');
        const referenceKey = `${href}+${coords}`;

        if (this._imageAreaCache[referenceKey]) {
            this._imageAreaCache[referenceKey].canShowModal = false;
        }

        $(constants.MAP_AREA_MODAL_CONTAINER).hide();
    }
}

module.exports = HoverPreview;
