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
        const isZoneLeft = zoneName.indexOf('left') > -1;
        const isZoneRight = zoneName.indexOf('right') > -1;
        const isZoneMiddle = zoneName === 'middle';
        const isZoneTopMiddle = zoneName === 'top-middle';

        if (isZoneRight || isZoneLeft) {
            let modalAdjustment;
            let adjustedWidthOffset;
            let adjustedModalHeight;

            modalAdjustment = isZoneLeft ? computedCoords.midX - modalWidth + 20 : computedCoords.midX + 30;
            adjustedWidthOffset = isZoneLeft && widthOffset > 0 ? widthOffset - 25 : widthOffset;
            adjustedModalHeight = Math.round(modalHeight / 2);

            modalPosition.left = modalAdjustment + adjustedWidthOffset;
            modalPosition.top = computedCoords.midY - adjustedModalHeight - 10;
            modalPosition.flagHeight = adjustedModalHeight;
            modalPosition.flagClass = isZoneLeft ? 'modal-flag-right' : 'modal-flag-left';
        } else if (isZoneMiddle || isZoneTopMiddle) {
            modalPosition.left = computedCoords.midX - 100 + widthOffset;
            modalPosition.top = computedCoords.midY - modalHeight - 40;
            modalPosition.flagHeight = modalHeight + 20;
            modalPosition.flagClass = 'modal-flag-bottom';
        } else {
            modalPosition.left = computedCoords.midX - 100 + widthOffset;
            modalPosition.top = computedCoords.midY + 30;
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

    showModal($, title, content, containsHTML, imageAreaReferenceKey) {
        const overViewData = {
            title,
            content,
            containsHTML
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

            this.showModal($, overview.Heading || overview.name, overview.Content, overview.containsHTML, imageAreaReferenceKey);
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

    getImagePartition(xCoord, yCoord) {
        const filtered = _.filter(this._imagePartition, (partition) => {
            return xCoord >= partition.minX && xCoord <= partition.maxX &&
            yCoord >= partition.minY && yCoord <= partition.maxY;
        });

        return filtered.length === 1 ? filtered[0].name : "";
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
        const zoneName = this.getImagePartition(computedCoordinates.midX, computedCoordinates.midY);
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

    generatePartitionObject(partitionName, minX, minY, maxX, maxY) {
        return {
            name: partitionName,
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
            midX: Math.round((minX + maxX) / 2),
            midY: Math.round((minY + minY) / 2)

        };
    }

    generateImagePartitions(width, height) {
        const partitionX = Math.floor(width / 3);
        const partitionY = Math.floor(height / 3);

        const q1MinX = 0;
        const q1MaxX = partitionX;

        const q2MinX = q1MaxX + 1;
        const q2MaxX = q1MaxX * 2;

        const q3MinX = q2MaxX + 1;
        const q3MaxX = width;

        const q1MinY = 0;
        const q1MaxY = partitionY;

        const q2MinY = q1MaxY + 1;
        const q2MaxY = q1MaxY * 2;

        const q3MinY = q2MaxY + 1;
        const q3MaxY = height;

        this._imagePartition = [];

        this._imagePartition.push(this.generatePartitionObject("top-left", q1MinX, q1MinY, q1MaxX, q1MaxY));
        this._imagePartition.push(this.generatePartitionObject("top-middle", q2MinX, q1MinY, q2MaxX, q1MaxY));
        this._imagePartition.push(this.generatePartitionObject("top-right", q3MinX, q1MinY, q3MaxX, q1MaxY));
        this._imagePartition.push(this.generatePartitionObject("middle-left", q1MinX, q2MinY, q1MaxX, q2MaxY));
        this._imagePartition.push(this.generatePartitionObject("middle", q2MinX, q2MinY, q2MaxX, q2MaxY));
        this._imagePartition.push(this.generatePartitionObject("middle-right", q3MinX, q2MinY, q3MaxX, q2MaxY));
        this._imagePartition.push(this.generatePartitionObject("bottom-left", q1MinX, q3MinY, q1MaxX, q3MaxY));
        this._imagePartition.push(this.generatePartitionObject("bottom-middle", q2MinX, q3MinY, q2MaxX, q3MaxY));
        this._imagePartition.push(this.generatePartitionObject("bottom-right", q3MinX, q3MinY, q3MaxX, q3MaxY));
    }

    onFocus($, event) {
        if (!this._imagePartition) {
            const imgHeight = Math.round($(constants.FIGURE_CONTAINER).children().height());
            const imgWidth = Math.round($(constants.FIGURE_CONTAINER).children().width());

            this.generateImagePartitions(imgWidth, imgHeight);
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
            this.showModal($, $(event.currentTarget).data('previewTitle'), null, null, referenceKey);
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
