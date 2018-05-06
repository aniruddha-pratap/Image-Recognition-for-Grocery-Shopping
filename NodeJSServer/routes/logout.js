var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
	req.session.destroy();
	var json_response = {statusCode: '200'};
	res.send(json_response);
});

module.exports = router;
