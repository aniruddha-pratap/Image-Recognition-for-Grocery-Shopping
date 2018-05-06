var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

router.post('/', function(req, res, next) {
		var json_responses = '';
		var username = req.session.username;
		console.log(username);
		var searchCart = "Select product, quantity from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
		mysql.fetchData(function(err, results){
			if(err){
				throw err;
			}
			else{
				if(results.length>0){
                    var deleteProduct = "delete from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
                    mysql.fetchData(function(err, rows){
                        if(err){
                            throw err;
                        }else{
                            json_responses = {'statusCode': 200};
                            res.send(json_responses);
                        }
                    }, deleteProduct);
				}
			}
		}, searchCart);
	});

module.exports = router;
