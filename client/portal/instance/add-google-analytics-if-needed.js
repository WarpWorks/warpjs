const DATA_KEY = 'warpjsGAalreadyAdded';

export default ($) => {
    const isHomePage = Boolean($('#warpjs-is-home-page-true').length);
    const hasGA = Boolean($('script[src="https://www.google-analytics.com/analytics.js"]').length);

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

            const onClick = $(element).attr('onClick');
            const onClickValue = `ga('send', 'event', 'Home', 'Visit', '${href}')`;
            if (!onClick) {
                $(element).attr('onClick', onClickValue);
                $(element).data(DATA_KEY, true);
            } else if (onClick !== onClickValue) {
                // There is some onclick predefined and it's not the exact GA
                // event. Let's add it.
                $(element).on('click', () => {
                    // eslint-disable-next-line no-undef
                    ga('send', 'event', 'Home', 'Visit', href);
                });
            }

        });
    }
};
