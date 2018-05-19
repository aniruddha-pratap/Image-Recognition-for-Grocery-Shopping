var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
	var response = '';
	if(req.session.username){
		var cart = "Select product, quantity, price from cart where addedBy = '"+req.session.username+"'";
		mysql.fetchData(function(err, results){
			if(err){
				throw err;
				
			}
			else{
				if(results.length>0){
					response = {'cart': results, statusCode: '200'};
					res.send(response);
				}else{
					response = {statusCode: '400'};
					res.send(response);
				}
			}
		},cart);
	}else{
		response = {statusCode: '401'};
		res.send(response);
	}
	
});

router.post('/', function(req, res, next) {
		var response = '';
		var username = req.session.username;
		console.log(username);
		var isProd = "UPDATE cart SET quantity = quantity + 1 where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
		var queryCart = "Select product, quantity from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
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
                            response = {'statusCode': 200};
                            res.send(response);
                        }
                    },isProd);
				}else{
					mysql.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else{
							response = {'statusCode': 200};
							res.send(response);
						}
					},cartItem);
				}
			}
		},queryCart);
		
	});



router.post('/updateTotal', function(req, res, next) {
    var response = '';
    var isProd = "UPDATE cart SET quantity = "+ req.param("quantity") +" where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
    var queryCart = "Select product, quantity from cart where product = '"+req.param("product")+"' AND addedBy = '"+ req.session.username +"'";
    mysql.fetchData(function(err,rows){
        if(err){
            throw err;
        }
        else{
            if(rows.length>0){
                mysql.fetchData(function(err,results){
                    if(err){
                        throw err;
                    }else{
                        response = {'statusCode': 200};
                        res.send(response);
                    }
                },isProd);
            }
        }
    },queryCart);

});

module.exports = router;
