import { NAME } from './../constants';

import MenuItem from './menu-item';

import _debug from './debug'; const debug = _debug('search-field');

const { Button } = window.WarpJS.ReactComponents;
const { DropdownButton, errorBoundary, FormControl, InputGroup, PropTypes } = window.WarpJS.ReactUtils;

const Component = (props) => {
    const inputGroupAddons = props.filters.reduce(
        (inputGroupAddons, aggregation) => {
            if (!aggregation.selected) {
                return inputGroupAddons;
            }

            return aggregation.items.reduce(
                (inputGroupAddons, entity) => {
                    if (!entity.selected) {
                        return inputGroupAddons;
                    }

                    const selectedFilters = entity.items.reduce(
                        (selectedFilters, firstLevel) => {
                            if (firstLevel.selected) {
                                debug(`firstLevel=`, firstLevel);
                                const firstLevelItem = <MenuItem key={firstLevel.id} level={1} label={firstLevel.label} onClick={firstLevel.onClick} />;
                                const secondLevelItems = firstLevel.items.reduce(
                                    (secondLevels, secondLevel) => {
                                        if (secondLevel.selected) {
                                            return secondLevels.concat(<MenuItem key={secondLevel.id} level={2} label={secondLevel.label} onClick={secondLevel.onClick} />);
                                        } else {
                                            return secondLevels;
                                        }
                                    },
                                    []
                                );
                                return selectedFilters.concat(firstLevelItem).concat(secondLevelItems);
                            } else {
                                return selectedFilters;
                            }
                        },
                        []
                    );

                    const dropdownTitle = entity.label || 'Untitled';
                    return inputGroupAddons.concat(
                        <InputGroup.Addon key={entity.id}>
                            <DropdownButton bsStyle="primary" title={dropdownTitle} key={`${entity.id}`} id={`warpjs-aggregation-filters-entity-${entity.id}`}>
                                {selectedFilters}
                            </DropdownButton>
                        </InputGroup.Addon>
                    );
                },
                inputGroupAddons
            );
        },
        []
    );

    const searchButton = props.searchValue || inputGroupAddons.length
        ? <Button style="primary" size="sm" glyph="remove" title="Clear search terms" onClick={props.clearSearchValue} inverse={true} outline={false} />
        : <Button style="primary" size="sm" glyph="search" inverse={true} outline={false} />
    ;

    return (
        <InputGroup>
            {inputGroupAddons}
            <FormControl type="text" value={props.searchValue} placeholder="Enter search terms" onChange={(event) => props.setSearchValue(event.target.value)} />
            <InputGroup.Addon>{searchButton}</InputGroup.Addon>
        </InputGroup>
    );
};

Component.displayName = `${NAME}SearchField`;

Component.propTypes = {
    clearSearchValue: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    searchValue: PropTypes.string,
    setSearchValue: PropTypes.func.isRequired
};

Component.defaultProps = {
    filters: []
};

export default errorBoundary(Component);
