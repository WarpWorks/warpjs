module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    console.log(`Request to delete ${domain}/${type}/${id}`);
    console.log('TODO: delete document');
    console.log('TODO: Log action');

    res.status(204).send();
};
