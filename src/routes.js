var authMiddleware = require('./middleware/auth');
var pipelinesController = require('./controllers/pipelines');

module.exports = function(app) {

    app.use('/api/*', authMiddleware);

    app.get('/', function (req, res) {
        res.send({message: 'Welcome to the API!'});
    });

    app.get('/api/pipelines', pipelinesController.getList);

};