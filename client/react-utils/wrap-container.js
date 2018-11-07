import { connect } from 'react-redux';

import errorBoundary from './error-boundary';
import baseComponentName from './base-component-name';

export default (Component, mapStateToProps, mapDispatchToProps, mergeProps) => {
    const Container = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Component);
    Container.displayName = `${baseComponentName(Component.displayName)}Container`;
    return errorBoundary(Container);
};
