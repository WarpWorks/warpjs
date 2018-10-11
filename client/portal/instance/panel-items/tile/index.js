const ITEMS_PER_ROW = 3;

module.exports = ($) => {
    $('.warpjs-relationship-style-Tile').each((idx, section) => {
        const items = $('.warpjs-value-item', section).get();
        for (let i = 0; i < items.length; i += ITEMS_PER_ROW) {
            const rowItems = items.slice(i, i + ITEMS_PER_ROW);

            let nbOfImagesToLoad = rowItems.reduce((total, item) => total + $('img', item).length, 0);

            if (nbOfImagesToLoad) {
                rowItems.forEach((item) => {
                    $('img', item).on('load', () => {
                        nbOfImagesToLoad--;

                        if (!nbOfImagesToLoad) {
                            // All image on the row are loaded.
                            const maxRowHeight = Math.max.apply(null, rowItems.map((item) => $(item).height()));
                            rowItems.forEach((item) => $(item).height(maxRowHeight));
                        }
                    });
                });
            } else {
                // No images on this row.
                const maxRowHeight = Math.max.apply(null, rowItems.map((item) => $(item).height()));
                rowItems.forEach((item) => $(item).height(maxRowHeight));
            }
        }
    });
};
