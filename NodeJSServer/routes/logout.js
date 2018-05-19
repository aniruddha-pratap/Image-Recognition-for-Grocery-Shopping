var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
	req.session.destroy();
	var res = {statusCode: '200'};
	res.send(res);
});

module.exports = router;
