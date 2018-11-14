import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './../action-creators';
import constants from './../../constants';

// import debug from './../../../debug';
// const log = debug('inline-edit/association-modal/orchestrators/update-association-description');


export default async (dispatch, relationship, event, item) => {
    const items = cloneDeep(relationship.items);
    const currentItem = items.find((anItem) => anItem.id === item.id);
    currentItem.relnDescription = event.target.value;

    constants.setDirty();
    dispatch(actionCreators.updateItems(items));
};
