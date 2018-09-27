module.exports = (req, res) => {
    res.cookie('w2cookies', JSON.stringify({ accepted: true }), { signed: true, httpOnly: true, sameSite: true });
    res.status(204).send();
};
