const debug = require('./debug')('post');

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { body } = req;

    debug(`type=${type}; id=${id}; body=${body}`);

    res.status(204).send();
};
