import { diffWords } from 'diff';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
// import PropTypes from 'prop-types';

// import { ACTIONS } from '@warp-works/warpjs-change-logs';

const { errorBoundary } = window.WarpJS.ReactUtils;

const TOO_MUCH_TEXT_LENGTH = 100;
const TOO_MUCH_TEXT_PART_LENGTH = (TOO_MUCH_TEXT_LENGTH - 5) / 2;

const diffText = (changeLog) => {
    const oldValue = isUndefined(changeLog.data.oldValue) || isNull(changeLog.data.oldValue)
        ? ''
        : changeLog.data.oldValue.toString()
    ;
    const newValue = isUndefined(changeLog.data.newValue) || isNull(changeLog.data.newValue)
        ? ''
        : changeLog.data.newValue.toString()
    ;

    const diffParts = diffWords(oldValue, newValue);
    const content = diffParts.map((part, index, arr) => {
        if (part.added) {
            return <span key={index} className="added">{part.value}</span>;
        } else if (part.removed) {
            return <span key={index} className="removed">{part.value}</span>;
        } else {
            let text = part.value;

            if (text.length > TOO_MUCH_TEXT_LENGTH) {
                if (index === 0) {
                    // First item. Only keep the last n characters.
                    text = `[...]${text.substring(text.length - (2 * TOO_MUCH_TEXT_PART_LENGTH), text.length)}`;
                } else if (index === arr.length - 1) {
                    // Last element. Only keep the first n characters.
                    text = `${text.substring(0, 2 * TOO_MUCH_TEXT_PART_LENGTH)}[...]`;
                } else {
                    // Anywhere else, Keep beginning and end.
                    text = `${text.substring(0, TOO_MUCH_TEXT_PART_LENGTH)}[...]${text.substring(text.length - TOO_MUCH_TEXT_PART_LENGTH, text.length)}`;
                }
            }

            return <span key={index} className="same">{text}</span>;
        }
    });

    return (
        <div className="warpjs-diff">{content}</div>
    );
};

const diffStatus = (changeLog) => {
    return (
        <div className="warpjs-diff-enum">
            <div className="warpjs-diff-enum-item">
                <span className="warpjs-change-log-fromTo-from-label">from</span>
                {' '}
                <span className={`warpjs-change-log-fromTo-from-value ${changeLog.data.fromClass || ''}`}>{changeLog.data.oldValue}</span>
            </div>
            <div className="warpjs-diff-enum-item">
                <span className="warpjs-change-log-fromTo-to-label">to</span>
                {' '}
                <span className={`warpjs-change-log-fromTo-to-value ${changeLog.data.newClass || ''}`}>{changeLog.data.newValue}</span>
            </div>
        </div>
    );
};

const Component = ({ changeLog }) => {
    if (changeLog.isEnum) {
        return diffStatus(changeLog);
    } else {
        return diffText(changeLog);
    }
};

Component.displayName = 'UserProfileNotificationsDiff';

// Component.propTypes = {
// changeLog: PropTypes.object.isRequired
// };

export default errorBoundary(Component);
