var restify = require('restify');
var service = require('./service.js');
 
var server = restify.createServer({
  name: 'nancycare',
  version: '1.0.0'
});

//server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var io = require('socket.io')(server.server);
io.on('connection', function (socket) {
  console.log('socket connected');
  
  service.setSocket(socket);

  socket.on('disconnect', function () {
      console.log('socket disconnected');
  });
});

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.get('/patient/:id/token/:token', function (req, res, next) {
  service.collectObservation(req.params.id, req.params.token, function (err, data){
  	if (err) {
  		res.send(500, err);
  		return;
  	};
  	res.send(data);
  	return next();
  });
});

server.get('/patient/:id/vital/:code', function (req, res, next){
  var query = req.params.query;
  console.log(req.params);
  service.search(req.params.id, req.params.code, query, function (err, data){
    if (err) {
      res.send(500, err);
      return;
    };
    res.send(data);
    return next();
  });
});
 

server.listen(9090, function () {
  console.log('%s listening at %s', server.name, server.url);
});