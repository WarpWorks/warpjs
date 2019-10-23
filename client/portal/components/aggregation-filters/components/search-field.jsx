import PropTypes from 'prop-types';
import { FormControl, InputGroup } from 'react-bootstrap';

import { NAME } from './../constants';
import * as SHAPES from './../shapes';

const { ActionIcon } = window.WarpJS.ReactComponents;
const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    let firstLevel = null;
    let secondLevel = null;

    if (props.selection) {
        const relationship = (props.aggregationFilters || []).find((reln) => reln.id === props.selection.relnId);

        if (relationship) {
            const entity = (relationship.entities || []).find((entity) => entity.id === props.selection.entityId);

            if (entity) {
                const firstLevelItem = (entity.items || []).find((item) => item.id === props.selection.firstLevelId);

                if (firstLevelItem) {
                    firstLevel = (
                        <InputGroup.Addon>
                            {firstLevelItem.name}
                            <ActionIcon glyph="remove" title={`Remove '${firstLevelItem.name}'`} onClick={() => firstLevelItem.onClick(false)} />
                        </InputGroup.Addon>
                    );

                    const secondLevelItem = (firstLevelItem.items || []).find((item) => item.id === props.selection.secondLevelId);
                    if (secondLevelItem) {
                        secondLevel = (
                            <InputGroup.Addon>
                                {secondLevelItem.name}
                                <ActionIcon glyph="remove" title={`Remove '${secondLevelItem.name}'`} onClick={() => secondLevelItem.onClick(false)} />
                            </InputGroup.Addon>
                        );
                    }
                }
            }
        }
    }

    return (
        <InputGroup>
            {firstLevel}
            {secondLevel}
            <FormControl type="text" value={props.searchValue} placeholder="Enter search terms" onChange={(event) => props.setSearchValue(event.target.value)} />
            <InputGroup.Addon>
                <ActionIcon glyph="remove" title={`Clear search terms`} onClick={props.clearSearchValue} />
            </InputGroup.Addon>
        </InputGroup>
    );
};

Component.displayName = `${NAME}SearchField`;

Component.propTypes = {
    aggregationFilters: PropTypes.arrayOf(SHAPES.RELATIONSHIP),
    clearSearchValue: PropTypes.func.isRequired,
    searchValue: PropTypes.string,
    selection: SHAPES.SELECTION,
    setSearchValue: PropTypes.func.isRequired
};

export default errorBoundary(Component);
