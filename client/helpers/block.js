// Idea from: https://gist.github.com/Wilfred/715ae4e22642cfff1dbd
const hbs = require('handlebars');

function loadPartial(name) {
    if (typeof hbs.partials[name] === 'string') {
        hbs.partials[name] = hbs.compile(hbs.partials[name]);
    }
    return hbs.partials[name];
}

module.exports = function pageBody(name, options) {
    const partial = loadPartial(name) || options.fn;
    return partial(this, { data: options.hash });
};
