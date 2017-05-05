const _ = require('lodash');
const utils = require('./../../../utils');
const modalTemplate = require('./../../templates/partials/map-area-modal.hbs');

class HoverPreview {
    constructor() {
        this._cache = [];
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

        $('#map-area-modal-container').html(modalTemplate(overViewData));
        $('#map-area-modal-container').show();
    }

    getResults($, href, cachedResult) {
        utils.getCurrentPageHAL($, href)
        .then((result) => {
            cachedResult.pending = false;
            cachedResult[href] = result.data;

            if(cachedResult.canShowModal) {
                this.extractDataAndShowModal($, result.data);
            }
        });
    }

    findCacheResultForHref(href) {
        const result = _.filter(this._cache, (object) => object.hasOwnProperty(href));

        return result;
    }

    onFocus($, event) {
        const href = $(event.currentTarget).data('targetHref');

        if (href) {
            const cachedResult = this.findCacheResultForHref(href);

            if(cachedResult.length) {
                cachedResult[0].canShowModal = true;

                if(!cachedResult[0].pending) {
                    this.extractDataAndShowModal($, cachedResult[0][href]);
                }
            } else {
                const objectToCache = {
                    pending: true,
                    canShowModal: true
                };

                objectToCache[href] = null;

                this._cache.push(objectToCache);
                this.getResults($, href, objectToCache);
            }
        } else {
            this.showModal($, $(event.currentTarget).data('previewTitle'));
        }
    }

    onBlur($, event) {
        const href = $(event.currentTarget).data('targetHref');
        const cachedResult = this.findCacheResultForHref(href);

        if(cachedResult.length) {
            cachedResult[0].canShowModal = false;
        }

        $('#map-area-modal-container').hide();
    }
}

module.exports = HoverPreview;
