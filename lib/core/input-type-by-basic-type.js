const basicTypes = require('./basic-types');

module.exports = {
    [basicTypes.String]: 'text',
    [basicTypes.Text]: 'text',
    [basicTypes.Password]: 'password',
    [basicTypes.Number]: 'number',
    [basicTypes.Boolean]: 'checkbox',
    [basicTypes.Date]: 'text'
};
