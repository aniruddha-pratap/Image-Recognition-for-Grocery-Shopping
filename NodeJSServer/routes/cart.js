var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
	var json_responses = '';
	if(req.session.username){
		var getCart = "Select product, quantity, price from cart where addedBy = '"+req.session.username+"'";
		mysql.fetchData(function(err, results){
			if(err){
				throw err;
				
			}
			else{
				if(results.length>0){
					json_responses = {'cart': results, statusCode: '200'};
					res.send(json_responses);
				}else{
					json_responses = {statusCode: '400'};
					res.send(json_responses);
				}
			}
		},getCart);
	}else{
		json_responses = {statusCode: '401'};
		res.send(json_responses);
	}
	
});

router.post('/', function(req, res, next) {
		var json_responses = '';
		var username = req.session.username;
		console.log(username);
		var prodExists = "UPDATE cart SET quantity = quantity + 1 where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
		var searchCart = "Select product, quantity from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
		var cartItem = "INSERT INTO cart (product, quantity, price, addedBy) values ('" + req.param("product") + "','" + '1' + "','" + Math.random()*5 + "','" + username + "')";
		mysql.fetchData(function(err,rows){
			if(err){
				throw err;
			}
			else{
				if(rows.length>0){
					var prodCartQuantity = rows[0].quantity;
					console.log('Cart Quantity:' + prodCartQuantity);
                    mysql.fetchData(function(err,results){
                        if(err){
                            throw err;
                        }else{
                            json_responses = {'statusCode': 200};
                            res.send(json_responses);
                        }
                    },prodExists);
				}else{
					mysql.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else{
							json_responses = {'statusCode': 200};
							res.send(json_responses);
						}
					},cartItem);
				}
			}
		},searchCart);
		
	});



router.post('/updateTotal', function(req, res, next) {
    var json_responses = '';
    var username = req.session.username;
    console.log(username);
    var prodExists = "UPDATE cart SET quantity = "+ req.param("quantity") +" where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
    var searchCart = "Select product, quantity from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
    mysql.fetchData(function(err,rows){
        if(err){
            throw err;
        }
        else{
            if(rows.length>0){
                var prodCartQuantity = rows[0].quantity;
                console.log('Cart Quantity:' + prodCartQuantity);
                mysql.fetchData(function(err,results){
                    if(err){
                        throw err;
                    }else{
                        json_responses = {'statusCode': 200};
                        res.send(json_responses);
                    }
                },prodExists);
            }
        }
    },searchCart);

});

module.exports = router;
