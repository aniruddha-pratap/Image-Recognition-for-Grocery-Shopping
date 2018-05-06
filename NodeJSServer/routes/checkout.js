var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

router.post('/', function(req, res, next){
	var json_response = '';
	var error ='';
	var cardNumber = req.param("cardNumber");
	//var cardCVV = req.param("cardCVV");
	//var expiration = req.param("expiration");
	console.log('Card Number:'+ cardNumber);
	var getCart = "select quantity, productId from cart where addedBy = '"+req.session.username+"'";
	if(cardNumber.length == '16' && !isNaN(cardNumber)){
		console.log('inside defined');
		mysql.fetchData(function(err,results){
	        if(err){
	          throw err;
	          json_response = {'statusCode': '400', 'error':'Snap! Something went wrong'};
	    	  res.send(json_response);
	        }
	        else 
	        {
	        	console.log('length'+ results.length);
	          if(results.length > 0){
	            var insertOrder = "INSERT INTO orders (product,quantity,owner) SELECT product,quantity,addedBY FROM cart where addedBy = '"+req.session.username+"'";
	            mysql.fetchData(function(err, rows){
	              if(err){
	                throw err;
	              }else{
	                console.log('Order Table Updated');
	                for(var i =0;i<results.length;i++){
	                    var alterProduct = "UPDATE products SET quantity = quantity - "+results[i].quantity+" WHERE p_id = '"+results[i].productId+"'";
	                    mysql.fetchData(function(err,rows){
	                      if(err){
	                        throw err;
	                      }else{
	                        if(rows.length>0){
	                          console.log("Product Table Modified");
	                        }
	                      }
	                    }, alterProduct);
	                }
	                console.log("Product Table Updated");
	                var removeCart = "DELETE FROM cart where addedBy = '"+req.session.username+"'";
	                mysql.fetchData(function(err, rows){
	                  if(err){
	                    throw err;
	                  }else{
	                    console.log("Cart deleted");
	                    json_response = {'statusCode': '200'};
	                    res.send(json_response);
	                  }
	                }, removeCart);
	              }
	            }, insertOrder);
	          }
	          else{
	        	  console.log('inside else');
	        	  json_response = {'statusCode': '400', 'error':'Cart is empty!'};
	        	  res.send(json_response);
	          }
	        }
	      },getCart);
	}
	else{
		json_response = {'statusCode': '400', 'error':'Credit Card number should be 16 didgit'};
  	  	res.send(json_response);
	}
});

module.exports = router;
