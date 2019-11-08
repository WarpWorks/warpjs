import PropTypes from 'prop-types';
import { FormControl, InputGroup } from 'react-bootstrap';

import { NAME } from './../constants';
import * as SHAPES from './../shapes';

const { ActionIcon, Button, Tooltip } = window.WarpJS.ReactComponents;
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
                            <Button style="primary" size="sm">
                                <Tooltip title={entity.name}><span>{firstLevelItem.name}</span></Tooltip>
                                <ActionIcon glyph="remove" title={`Remove '${firstLevelItem.name}'`} onClick={() => firstLevelItem.onClick(false)} />
                            </Button>
                        </InputGroup.Addon>
                    );

                    const secondLevelItem = (firstLevelItem.items || []).find((item) => item.id === props.selection.secondLevelId);
                    if (secondLevelItem) {
                        secondLevel = (
                            <InputGroup.Addon>
                                <Button style="primary" size="sm">
                                    <Tooltip title={`${entity.name} / ${firstLevelItem.name}`}><span>{secondLevelItem.name}</span></Tooltip>
                                    <ActionIcon glyph="remove" title={`Remove '${secondLevelItem.name}'`} onClick={() => secondLevelItem.onClick(false)} />
                                </Button>
                            </InputGroup.Addon>
                        );
                    }
                }
            }
        }
    }

    const searchButton = props.searchValue || firstLevel
        ? <Button style="primary" size="sm" glyph="remove" title="Clear search terms" onClick={props.clearSearchValue} inverse={true} outline={false} />
        : <Button style="primary" size="sm" glyph="search" inverse={true} outline={false} />
    ;

    return (
        <InputGroup>
            {firstLevel}
            {secondLevel}
            <FormControl type="text" value={props.searchValue} placeholder="Enter search terms" onChange={(event) => props.setSearchValue(event.target.value)} />
            <InputGroup.Addon>{searchButton}</InputGroup.Addon>
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
