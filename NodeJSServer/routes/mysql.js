var ejs= require('ejs');
var mysql = require('mysql');
var connPool = [];


//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'Give your db host name',
	    user     : 'Give username',
	    password : 'Give password',
	    database : 'ImageRecognition',
	    port	 : 3306
	});
	return connection;
}

for(var i = 0;i<5;i++){
	var connection = getConnection();
	connPool.push(connection);
}

function exportConnection(){
	if(connPool.length != 0){
		return connPool.pop();
	}
	else{
		setInterval(function(){
			exportConnection();
		},1);
	}
}

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	var connection=exportConnection();
	console.log("After popping: "+connPool.length);
	connection.query(sqlQuery, function(err, rows, fields) {
		console.log("\nConnection released..");
		connPool.push(connection);
		console.log("After pushing: "+connPool.length);
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	
}	

exports.fetchData=fetchData;