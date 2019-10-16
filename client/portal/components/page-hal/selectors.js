import namespace from './namespace';

const { getNamespaceSubstate } = window.WarpJS.ReactUtils;

export const pageHalSubstate = (state = {}) => {
    return getNamespaceSubstate(state, namespace);
};

export const pageSubstate = (state = {}) => {
    const pageHal = pageHalSubstate(state);

    if (pageHal && pageHal.pages && pageHal.pages.length) {
        return pageHal.pages[0];
    } else {
        return {};
    }
};

export const warpjsUser = (state = {}) => {
    const pageHal = pageHalSubstate(state);

    return pageHal.warpjsUser;
};
