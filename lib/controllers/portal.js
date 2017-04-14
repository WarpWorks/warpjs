module.exports = (req, res) => {
    res.render('portal' + req.params.domain, { title: 'test', layout: '_portalLayout' });
};
