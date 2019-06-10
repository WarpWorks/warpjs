import ReactDOM from 'react-dom';

import IndividualContributionHeader from './../components/individual-contribution-header';

const PLACEHOLDER = 'warpjs-individual-contribution-header-placeholder';

export default () => {
    const placeholder = document.getElementById(PLACEHOLDER);
    if (placeholder) {
        ReactDOM.render(<IndividualContributionHeader page={window.WarpJS.PAGE_HAL.pages[0]} />, placeholder);
    }
};
