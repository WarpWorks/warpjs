import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import comingSoon from './../../inline-edit/coming-soon';

import { NAME } from './constants';

const Component = (props) => {
    if (props.aggregations.length) {
        const selectedAggregation = props.aggregations.find((aggregation) => aggregation.id === props.aggregationSelected);
        const selectedAggregationLabel = selectedAggregation ? selectedAggregation.label : '';

        const options = props.aggregations.map((option) => {
            const classNames = classnames({
                'warpjs-paragraph-aggregations-none': option.id === -1,
                'warpjs-paragraph-aggregations-option-selected': option.id === props.aggregationSelected
            });

            return (
                <li key={option.id} className={classNames} title={option.label}
                    onClick={() => props.updateAggregation(option.id)}
                >{option.label}</li>
            );
        });

        const currentAggregationClassnames = classnames({
            'text': true,
            'warpjs-paragraph-aggregations-none': props.aggregationSelected === -1
        });

        const editButton = props.aggregationSelected === -1
            ? null
            : <span className="warpjs-paragraph-aggregations-edit-button" onClick={() => props.editAggregation(props.aggregationSelected)}>Edit</span>
        ;

        return (
            <Fragment>
                <span className="dropdown warpjs-paragraph-aggregations-dropdown">
                    <span className="dropdown-toggle"
                        id="warpjs-paragraph-aggregations"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="true"
                    >
                        <span className={currentAggregationClassnames} title={selectedAggregationLabel}>{selectedAggregationLabel}</span>
                        <span className="caret"></span>
                    </span>
                    <ul className="dropdown-menu" aria-labelledby="warpjs-paragraph-aggregations">
                        {options}
                    </ul>
                </span>
                {editButton}
            </Fragment>
        );
    } else {
        return (
            <div className="warpjs-paragaph-aggregations-empty">
                No aggregations available for this document.
            </div>
        );
    }
};

Component.displayName = NAME;

Component.propTypes = {
    aggregations: PropTypes.array.isRequired,
    aggregationSelected: PropTypes.string,
    editAggregation: PropTypes.func.isRequired,
    updateAggregation: PropTypes.func.isRequired
};

Component.defaultProps = {
    aggregations: [],
    aggregationSelected: -1,
    updateAggregation: () => comingSoon($, "Update aggregation"), // FIXME
    editAggregation: () => comingSoon($, "Edit aggregation") // FIXME
};

export default window.WarpJS.ReactUtils.errorBoundary(Component);
