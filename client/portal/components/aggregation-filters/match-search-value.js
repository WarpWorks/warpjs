import containsFragment from './contains-fragment';

export default (searchValue, item) => (searchValue || '').toLowerCase().split(' ').reduce(
    (returnValue, fragment) => {
        if (!returnValue) {
            return false;
        }

        if (containsFragment(item.docName, fragment) ||
            containsFragment(item.docType, fragment) ||
            containsFragment(item.docDesc, fragment) ||
            containsFragment(item.docKeywords, fragment)) {
            return true;
        }

        return false;
    },
    true
);
