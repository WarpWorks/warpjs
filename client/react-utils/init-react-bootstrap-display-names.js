import * as ReactRedux from 'react-redux';
import * as ReactBootstrap from 'react-bootstrap';

const setDisplayName = (reactPackage, componentName) => {
    reactPackage[componentName].displayName = reactPackage[componentName].displayName || componentName;
};

export default () => {
    [
        'Provider'
    ].forEach((componentName) => setDisplayName(ReactRedux, componentName));

    [
        'Alert',
        'Button',
        'Col',
        'ControlLabel',
        'FormControl',
        'FormGroup',
        'Glyphicon',
        'Grid',
        'HelpBlock',
        'Row'
    ].forEach((componentName) => setDisplayName(ReactBootstrap, componentName));
};
