const ACCEPTABLE_VISIBILITY = [
    'PDF',
    'WebAndPDF'
];

module.exports = (paragraph) => !paragraph.Visibility || ACCEPTABLE_VISIBILITY.indexOf(paragraph.Visibility) !== -1;
