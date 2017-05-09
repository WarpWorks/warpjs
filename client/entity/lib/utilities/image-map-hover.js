const _ = require('lodash');
const utils = require('./../../../utils');
const modalTemplate = require('./../../templates/partials/map-area-modal.hbs');
const constants = require('./constants.js');

class HoverPreview {
    constructor() {
        this._cache = [];
        this._currentImgAreaCoords = [];
    }

    getImageAreaCoord(coordinate) {
        switch (coordinate) {
            case 'x1':
                return this._currentImgAreaCoords[0];
            case 'y1':
                return this._currentImgAreaCoords[1];
            case 'x2':
                return this._currentImgAreaCoords[2];
            case 'y2':
                return this._currentImgAreaCoords[3];
            default:
                return 0;
        }
    }

    getWidthOffset() {
        const bootstrapRowWidth = $(constants.FIGURE_CONTAINER).parent().width();
        const imgWidth = $(constants.FIGURE_CONTAINER).children().width();

        if (!$(constants.FIGURE_CONTAINER).hasClass('pull-left') && (bootstrapRowWidth - imgWidth) >= 0) {
            return (bootstrapRowWidth - imgWidth) / 2;
        }

        return 0;
    }

    updateModalCSS(modalX, modalY, modalFlagX, modalFlagY) {
        $(constants.MAP_AREA_MODAL_CONTAINER).css({left: `${modalX}px`, top: `${modalY}px`});
        $(constants.MAP_AREA_MODAL_FLAG).css({left: `${modalFlagX}px`, top: `${modalFlagY}px`});
    }

    calculateModalPosition(modalHeight) {
        const modalX1 = this.getImageAreaCoord('x2') + 30 + this.getWidthOffset();
        const modalY1 = this.getImageAreaCoord('y2') - (this.getImageAreaCoord('y2') - this.getImageAreaCoord('y1'));
        const modalFlagX1 = this.getImageAreaCoord('x2') + 21 + this.getWidthOffset();
        const modalFlagY1 = (modalHeight / 2) + (this.getImageAreaCoord('y2') - (this.getImageAreaCoord('y2') - this.getImageAreaCoord('y1')));

        this.updateModalCSS(modalX1, modalY1, modalFlagX1, modalFlagY1);
    }

    extractDataAndShowModal($, resultData) {
        let overViewData = _.filter(resultData._embedded.panels, (panel) => panel.type === "Overview");

        if (overViewData[0]._embedded.overviews.length) {
            const overview = overViewData[0]._embedded.overviews[0];

            this.showModal($, overview.Heading || overview.name, overview.Content, overview.containsHTML);
        }
    }

    showModal($, title, content, containsHTML) {
        const overViewData = {
            title,
            content,
            containsHTML
        };

        $(constants.MAP_AREA_MODAL_CONTAINER).html(modalTemplate(overViewData));
        $(constants.MAP_AREA_MODAL_CONTAINER).show();
        $(constants.MAP_AREA_MODAL_FLAG).show();

        this.calculateModalPosition($(constants.MAP_AREA_MODAL_CONTAINER).height());
    }

    getResults($, href) {
        utils.getCurrentPageHAL($, href)
        .then((result) => {
            this._cache[href].pending = false;
            this._cache[href].result = result.data;

            if (this._cache[href].canShowModal) {
                this.extractDataAndShowModal($, result.data);
            }
        });
    }

    onFocus($, event) {
        this._currentImgAreaCoords = _.reduce($(event.currentTarget).attr('coords').split(","), (memo, value, key) => {
            memo.push(parseInt(value));
            return memo;
        }, []);

        const href = $(event.currentTarget).data('targetHref');

        if (href) {
            const cachedResult = this._cache[href];

            if (cachedResult) {
                cachedResult.canShowModal = true;

                if (!cachedResult.pending) {
                    this.extractDataAndShowModal($, cachedResult.result);
                }
            } else {
                const objectToCache = {
                    pending: true,
                    canShowModal: true,
                    result: null
                };

                this._cache[href] = objectToCache;
                this.getResults($, href);
            }
        } else {
            this.showModal($, $(event.currentTarget).data('previewTitle'));
        }
    }

    onBlur($, event) {
        this._currentImgAreaCoords = [];
        this.updateModalCSS(0, 0, 0, 0);

        const href = $(event.currentTarget).data('targetHref');

        if (this._cache[href]) {
            this._cache[href].canShowModal = false;
        }

        $(constants.MAP_AREA_MODAL_CONTAINER).hide();
        $(constants.MAP_AREA_MODAL_FLAG).hide();
    }
}

module.exports = HoverPreview;
