/**
 *  This module handles the display of separator items in the portal.
 *
 *  Rules:
 *
 *  - First visible element cannot be a separator.
 *  - Last visible element cannot be a separator.
 *  - Two consecutive visible elements cannot be separators.
 */
const SPI_SECTION_CLASS = 'warpjs-panel-section-SeparatorPanelItem';
const HIDE_SPI_CLASS = 'warpjs-hide-spi';

const process = ($, body) => {
    const children = $(body).children();

    children.each((childIndex, child) => {
        if ($(child).hasClass(SPI_SECTION_CLASS)) {
            let foundVisibleItem = false;
            for (let reverseIndex = childIndex - 1; reverseIndex >= 0; reverseIndex--) {
                if ($(children[reverseIndex]).hasClass(SPI_SECTION_CLASS)) {
                    break;
                } else if ($(children[reverseIndex]).is(':visible')) {
                    foundVisibleItem = true;
                    break;
                }
            }

            if (!foundVisibleItem) {
                $(child).addClass(HIDE_SPI_CLASS);
            }
        }
    });

    // Make sure the last element that is visible is not a separator.
    for (let childIndex = (children.length - 1); childIndex >= 0; childIndex--) {
        if ($(children[childIndex]).is(':visible')) {
            if ($(children[childIndex]).hasClass(SPI_SECTION_CLASS)) {
                $(children[childIndex]).addClass(HIDE_SPI_CLASS);
            } else {
                break;
            }
        }
    }
};


module.exports = ($) => {
    $('.warpjs-is-overview-panel- + .panel-body').each((index, panelBody) => process($, panelBody));
    $('.warpjs-page-view-sidebar-body').each((index, sidebarBody) => process($, sidebarBody));
};
