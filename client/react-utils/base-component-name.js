import { SUFFIX } from './error-boundary';

export default (componentName) => {
    const indexOfSuffix = componentName.indexOf(SUFFIX);

    return indexOfSuffix === -1 ? componentName : componentName.slice(0, indexOfSuffix);
};
