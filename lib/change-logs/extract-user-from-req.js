module.exports = (req) => ({
    id: req.warpjsUser.id,
    type: req.warpjsUser.type,
    name: req.warpjsUser.Name,
    username: req.warpjsUser.UserName
});
