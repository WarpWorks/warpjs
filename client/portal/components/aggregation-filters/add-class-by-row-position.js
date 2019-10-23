import { SUB_CLASS } from './constants';

export default (item, index) => {
    $(item).addClass(SUB_CLASS[index % 3]);
};
