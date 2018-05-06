var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

router.post('/', function(req, res, next) {
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
            } else {
                json_responses = {'statusCode': 400};
                res.send(json_responses);
            }
        }
    },searchCart);

});

module.exports = router;
