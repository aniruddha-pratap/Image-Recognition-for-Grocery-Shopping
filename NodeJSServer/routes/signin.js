var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var crypto = require('crypto');
var key = '6789';

router.post('/', function(req, res, next){
	var json_response = '';
	var passEntered = req.param("password");
	console.log("Password "+passEntered);
	var enteredPassword = crypto.createHmac('sha1', key).update(passEntered).digest('hex');
	var getUser= "select username, password from User where username='"+req.param("username")+"' AND password ='"+enteredPassword+"'";
	console.log("Query is:"+getUser);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log('Pass from DB' + results[0].password);
				req.session.username = req.param("username");
                json_response = {'username': req.session.username, 'statusCode': '200'};
                res.send(json_response);
            }
			else{
				console.log("In error");
				json_response = {'statusCode': '400','error':'Username or Password is not correct'};
				res.send(json_response);
			}
		}
	},getUser);
});

module.exports = router;
