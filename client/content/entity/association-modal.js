module.exports = ($) => {
    $('[data-warpjs-action="relationship-csv-modal"]').on('click', function() {
        console.log("association-modal: clicked", this);
    });
};
