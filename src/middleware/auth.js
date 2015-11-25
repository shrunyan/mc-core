module.exports = function (req, res, next) {

    if (false) {
        res.status(401).send('Not logged in!');
        return;
    }

    next();

};