var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var crypto = require('crypto');
var key = '6789';

router.post('/', function(req, res, next){
	var response = '';
	var password = req.param("password");
	var encryptedPass = crypto.createHmac('sha1', key).update(password).digest('hex');
	var fetchUser= "select username, password from User where username='"+req.param("username")+"' AND password ='"+encryptedPass+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log('Pass from DB' + results[0].password);
				req.session.username = req.param("username");
                response = {'username': req.session.username, 'statusCode': '200'};
                res.send(response);
            }
			else{
				console.log("In error");
				response = {'statusCode': '400','error':'Username or Password is not correct'};
				res.send(response);
			}
		}
	},fetchUser);
});

module.exports = router;
