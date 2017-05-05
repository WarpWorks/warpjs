const _ = require('lodash');
const utils = require('./../../../utils');
const modalTemplate = require('./../../templates/partials/map-area-modal.hbs');

class HoverPreview {
    constructor() {
        this._cache = [];
        this._pendingRequest = false;
    }

    extractDataAndShowModal($, resultData) {
        let overViewData = _.filter(resultData._embedded.panels, (panel) => panel.type === "Overview");

        if (overViewData[0]._embedded.overviews.length) {
            this.showModal($, overViewData[0]._embedded.overviews[0]);
        }
    }

    showModal($, overViewData) {
        $('#map-area-modal-container').html(modalTemplate(overViewData));
        $('#map-area-modal-container').show();
    }

    getResults($, href) {
        utils.getCurrentPageHAL($, href)
        .then((result) => {
            this._cache.push({
                checkedHref: href,
                result: result.data
            });
            this._pendingRequest = false;
            this.extractDataAndShowModal($, result.data);
        });
    }

    mouseEnter($, event) {
        const href = $(event.currentTarget).data('targetHref');

        if (href) {
            if (this._cache.length) {
                const foundResult = {
                    found: false,
                    result: null
                };

                this._cache.forEach((result) => {
                    if (result.checkedHref === href) {
                        foundResult.found = true;
                        foundResult.result = result;
                    }
                });

                if (foundResult.found) {
                    this.extractDataAndShowModal($, foundResult.result.result);
                } else {
                    this._pendingRequest = true;
                    this.getResults($, href);
                }
            } else {
                if (!this._pendingRequest) {
                    this._pendingRequest = true;
                    this.getResults($, href);
                }
            }
        } else {
            let resultData = {
                name: $(event.currentTarget).data('previewTitle')
            };

            this.showModal($, resultData);
        }
    }

    mouseLeave($, event) {
        $('#map-area-modal-container').hide();
    }
}

module.exports = HoverPreview;
