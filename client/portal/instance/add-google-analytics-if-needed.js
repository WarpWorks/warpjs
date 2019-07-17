// import debug from './../debug';
// const log = debug('/instance/add-google-analytics-if-needed');

const DATA_KEY = 'warpjsGAalreadyAdded';

const forceCallOnTimeout = (callback, delay) => {
    // Need eslint to ignore this because we need `fn` that uses closure on
    // `timeout`
    //      eslint-disable-next-line prefer-const
    let timeout;

    const fn = () => {
        clearTimeout(timeout);
        callback();
    };

    timeout = setTimeout(fn, delay || 500);
    return fn;
};

export default ($) => {
    const isHomePage = Boolean($('#warpjs-is-home-page-true').length);
    const hasGA = Boolean($('script[src="https://www.google-analytics.com/analytics.js"]').length);

    // log(`isHomePage=${isHomePage}, hasGA=${hasGA}`);
    // log(`window.ga=`, window.ga);

    if (isHomePage && hasGA && window.ga) {
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

            // log(`analyzing element=`, element);

            $(element).on('click', (event) => {
                event.preventDefault();

                const href = $(element).attr('href') || $(element).attr('xlink:href');
                // log(`<a> clicked: ${href}`);

                window.gtag('event', 'Visit', {
                    event_category: 'Home',
                    event_label: href,
                    event_callback: forceCallOnTimeout(() => {
                        document.location.href = href;
                    })
                });
            });
        });
    }
};
