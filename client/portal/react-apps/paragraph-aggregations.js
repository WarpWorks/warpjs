import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as ParagraphAggregations from './../components/paragraph-aggregations';

// import _debug from './debug'; const debug = _debug('index');

const PLACEHOLDER = 'warpjs-paragraph-aggregations';

export default async ($, modal, clickedElement) => {
    // debug(`clickedElement=`, clickedElement);

    const aggregationSelected = parseInt($(clickedElement).data('warpjsSubdocuments') || -1, 10);
    const aggregations = $(modal).data('warpjsAggregations');

    const warpjsData = {
        type: $(clickedElement).data('warpjsType'),
        id: $(clickedElement).data('warpjsId'),
        reference: {
            type: $(clickedElement).data('warpjsReferenceType'),
            id: $(clickedElement).data('warpjsReferenceId')
        }
    };

    window.WarpJS.STORE.dispatch(ParagraphAggregations.initialize(aggregations, aggregationSelected, warpjsData, clickedElement));

    ReactDOM.render(
        <Provider store={window.WarpJS.STORE} id={PLACEHOLDER}>
            <ParagraphAggregations.Container />
        </Provider>,
        $(`.${PLACEHOLDER}`).get(0)
    );
};

