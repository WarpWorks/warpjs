const first = require('./first');
const next = require('./next');
const walkRelationship = require('./walk-relationship');

function walk(docLevel, entity, instance) {
    const firstLevel = first(docLevel);

    if (firstLevel) {
        if (firstLevel.type === 'Relationship') {
            return walkRelationship(next(docLevel), entity, instance, firstLevel.value);
        }
    } else {
        //  We passed last level.
        console.log("walk(): no firstLevel?");
    }
}

module.exports = walk;
