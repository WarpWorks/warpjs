import * as actionCreators from './../action-creators';

// import debug from './../../../debug';
// const log = debug('inline-edit/association-modal/orchestrators/type-selected');

const { proxy, toast } = window.WarpJS;

export default async (dispatch, relationship, event) => {
    const value = parseInt(event.target.value, 10);
    const target = relationship.targets.find((target) => target.id === value);
    if (!target.entities) {
        const toastLoading = toast.loading($, "Loading...");
        try {
            const res = await proxy.get($, target._links.instances.href);
            dispatch(actionCreators.typeChanged(value, res._embedded.entities));
        } catch (err) {
            console.error(`Error loading entities of type ${value}!`, err);
            toast.error($, err.message, "Error loading data!");
        } finally {
            toast.close($, toastLoading);
        }
    } else {
        // If already defined, just make sure to set the selected.
        dispatch(actionCreators.typeChanged(value));
    }
};
