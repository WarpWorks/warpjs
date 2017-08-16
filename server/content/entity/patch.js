module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    console.log(`PATCH for ${domain}/${type}/${id}`);
    console.log(`PATCH body:`, payload);

    console.log("TODO: apply action");
    console.log("TODO: Log action");

    res.status(204).send();
};
