// Idea from: https://gist.github.com/Wilfred/715ae4e22642cfff1dbd
const hbs = require('handlebars');

module.exports = function partial(name, options) {
    hbs.registerPartial(name, options.fn);
};
