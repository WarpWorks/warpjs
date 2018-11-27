
// import debug from './../debug';
// const log = debug('/instance/add-google-analytics-if-needed');

const DATA_KEY = 'warpjsGAalreadyAdded';

export default ($) => {
    const isHomePage = Boolean($('#warpjs-is-home-page-true').length);
    const hasGA = Boolean($('script[src="https://www.google-analytics.com/analytics.js"]').length);

    // log(`isHomePage=${isHomePage}, hasGA=${hasGA}`);

    if (isHomePage && hasGA) {
        $('a').each((index, element) => {
            const alreadyHasGA = $(element).data(DATA_KEY);
            if (alreadyHasGA) {
                return;
            }

            const href = $(element).attr('href') || $(element).attr('xlink:href') || '';
            if (href.indexOf('#') === 0) {
                return;
            }

            $(element).data(DATA_KEY, true);

            $(element).on('click', (event) => {
                event.preventDefault();

                const href = $(event.target).attr('href');

                // log(`<a> clicked: ${href}`);

                window.gtag('event', 'Visit', {
                    event_category: 'Home',
                    event_label: href,
                    event_callback: () => {
                        document.location.href = href;
                    }
                });
            });
        });
    }
};
