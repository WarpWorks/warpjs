import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './action-creators';
import Component from './component';
import wrapContainer from './../../../../../react-utils/wrap-container';

const mapStateToProps = (state, ownProps) => Object.freeze({
    name: state.name,
    relationship: state && state.items && state.items.length ? state.items[0] : {}
});

const mapDispatchToProps = (dispatch, ownProps) => Object.freeze({
    moveUp: async (items, item) => {
        console.log("moveUp(): items=", items, "; item=", item);
        const cloned = cloneDeep(items);

        const toUpdate = [];
        cloned.forEach((currentItem, index) => {
            if (currentItem.relnPosition !== index + 1) {
                currentItem.relnPosition = index + 1;
                toUpdate.push(currentItem);
            }
        })

        const indexOf = cloned.findIndex((currentItem) => currentItem.id === item.id);
        console.log("indexOf=", indexOf);
        if (indexOf) {
            cloned[indexOf].relnPosition = indexOf;
            toUpdate.push(cloned[indexOf]); // FIXME: Check if already there first.
            cloned[indexOf - 1].relnPosition = indexOf + 1;
            toUpdate.push(cloned[indexOf - 1]); // FIXME: Check if already there first.
        }

        console.log("toUpdate=", toUpdate);
        cloned.sort((a, b) => a.relnPosition - b.relnPosition);
        console.log("new cloned=", cloned);

        dispatch(actionCreators.updateItems(cloned));
    }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    ...ownProps
});

export default wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
