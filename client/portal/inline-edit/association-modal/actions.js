import extend from 'lodash/extend';

import namespace from './namespace';

export default Object.freeze(
    [
        'INITIAL_STATE'
    ].reduce((map, key) => extend(map, { [key]: namespace(key) }), {})
);
