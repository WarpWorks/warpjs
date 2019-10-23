import addClassByRowPosition from './add-class-by-row-position';
import { HIDE } from './constants';

export default (panel) => {
    $(`.warpjs-relationship-panel-item-tile:not(.${HIDE})`, panel).each((index, item) => addClassByRowPosition(item, index));
};
