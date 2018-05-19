var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

router.post('/', function(req, res, next) {
		var response = '';
		var searchCart = "Select product, quantity from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
		mysql.fetchData(function(err, results){
			if(err){
				throw err;
			}
			else{
				if(results.length>0){
                    var removeFromCart = "delete from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
                    mysql.fetchData(function(err, rows){
                        if(err){
                            throw err;
                        }else{
                            response = {'statusCode': 200};
                            res.send(response);
                        }
                    }, removeFromCart);
				}
			}
		}, searchCart);
	});

module.exports = router;
