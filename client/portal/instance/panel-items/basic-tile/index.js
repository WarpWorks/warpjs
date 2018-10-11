const ITEMS_PER_ROW = 3;

module.exports = ($) => {
    $('.warpjs-relationship-style-Basic_Tile').each((idx, section) => {
        const items = $('.warpjs-value-item', section).get();
        for (let i = 0; i < items.length; i += ITEMS_PER_ROW) {
            const row = items.slice(i, i + ITEMS_PER_ROW);
            const maxRowHeight = Math.max.apply(null, row.map((item) => $(item).height()));
            row.forEach((item) => $(item).height(maxRowHeight));
        }
    });
};
