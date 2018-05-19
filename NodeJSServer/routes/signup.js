var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var crypto = require('crypto');
var key = '6789';

router.post('/', function(req, res, next){
	var response = '';
	var fetchUser="select * from User where username='"+req.param("username")+"'";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				response = {'statusCode': '400'};
				res.send(response);
			}
			else {    
				console.log("Valid Login");
				var username = req.param("username");
				var name = req.param("name");
				var encryptPass = crypto.createHmac('sha1', key).update(req.param("password")).digest('hex');
				var newUser = "INSERT INTO User (name,username,password) values ('" + name + "','" + username + "','" + encryptPass +"')";
				mysql.fetchData(function(err, results){
					if(err){
						throw err;
					}
					else{
						req.session.username = username;
						response = {'username': req.session.username, 'statusCode': '200'};
						res.send(response);
					}
				}, newUser);
			}
		}  
	},fetchUser);

});


module.exports = router;
