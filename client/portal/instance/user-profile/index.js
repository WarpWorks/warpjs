const comingSoon = require('./../../inline-edit/coming-soon');

module.exports = ($) => {
    $('.warpjs-page-view-UserProfile').on('click', '.warpjs-user-profile-notifications', async (event) => {
        comingSoon($, "Showing notififications");
    });

    $('.warpjs-page-view-UserProfile').on('click', '.warpjs-user-profile-documents', async (event) => {
        comingSoon($, "Showing documents");
    });
};
