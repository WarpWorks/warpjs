import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './action-creators';
import Component from './component';

const mapStateToProps = (state, ownProps) => Object.freeze({
    name: state.name,
    relationship: state && state.items && state.items.length ? state.items[0] : {}
});

const setPositions = (items) => {
    const toUpdate = [];

    items.forEach((item, index) => {
        if (item.relnPosition !== index + 1) {
            item.relnPosition = index + 1;
            toUpdate.push(item);
        }
    });

    return toUpdate;
};

const swap = (items, x, y) => {
    const tmp = items[x];
    items[x] = items[y];
    items[y] = tmp;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const moveItem = async (items, item, moveDown, url) => {
        const cloned = cloneDeep(items);
        const indexOf = cloned.findIndex((currentItem) => currentItem.id === item.id);

        if (indexOf !== -1) {
            swap(cloned, indexOf, indexOf + (moveDown ? 1 : -1));
        }

        const toUpdate = setPositions(cloned);
        cloned.sort((a, b) => a.relnPosition - b.relnPosition);

        const toastLoading = window.WarpJS.toast.loading($, "saving...");
        try {
            await window.WarpJS.proxy.patch($, url, toUpdate);

            window.WarpJS.toast.success($, "Saved");
            dispatch(actionCreators.updateItems(cloned));
        } catch (err) {
            console.error("error patch:", err);
            window.WarpJS.toast.error($, err.message, "Error!");
        } finally {
            window.WarpJS.toast.close($, toastLoading);
        }
    };

    return Object.freeze({
        moveDown: (url) => async (items, item) => moveItem(items, item, true, url),
        moveUp: (url) => async (items, item) => moveItem(items, item, false, url),
        removeItem: async (items, item) => {
            const cloned = cloneDeep(items).filter((current) => current.id !== item.id);

            const toastLoading = window.WarpJS.toast.loading($, "saving...");
            try {
                // TODO: Save toUpdate().
                console.log("TODO: Send delete to server: item=", item);
                window.WarpJS.toast.success($, "Saved");
                dispatch(actionCreators.updateItems(cloned));
            } catch (err) {
                window.WarpJS.toast.error($, err.message, "Error!");
            } finally {
                window.WarpJS.toast.close($, toastLoading);
            }
        }
    });
};

const mergeProps = (stateProps, dispatchProps, ownProps) => Object.freeze({
    ...stateProps,
    ...dispatchProps,
    moveDown: dispatchProps.moveDown(stateProps.relationship._links.reorder.href),
    moveUp: dispatchProps.moveUp(stateProps.relationship._links.reorder.href),
    ...ownProps
});

export default window.WarpJS.ReactUtils.wrapContainer(Component, mapStateToProps, mapDispatchToProps, mergeProps);
