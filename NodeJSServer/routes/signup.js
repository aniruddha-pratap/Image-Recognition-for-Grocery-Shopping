var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var crypto = require('crypto');
var key = '6789';

router.post('/', function(req, res, next){
	var json_responses = '';
	var getUser="select * from User where username='"+req.param("username")+"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Invalid Login");
				json_responses = {'statusCode': '400'};
				res.send(json_responses);
			}
			else {    
				console.log("Valid Login");
				var username = req.param("username");
				var name = req.param("name");
				var passwordToSave = crypto.createHmac('sha1', key).update(req.param("password")).digest('hex');
				//var passwordToSave = bcrypt.hashSync(req.param("password"), salt);
				console.log("Password to save: "+ passwordToSave);
				var newUser = "INSERT INTO User (name,username,password) values ('" + name + "','" + username + "','" + passwordToSave +"')";
				mysql.fetchData(function(err, results){
					if(err){
						throw err;
					}
					else{
						req.session.username = username;
						json_responses = {'username': req.session.username, 'statusCode': '200'};
						res.send(json_responses);
					}
				}, newUser);
			}
		}  
	},getUser);

});


module.exports = router;
