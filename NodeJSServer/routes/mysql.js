var ejs= require('ejs');
var mysql = require('mysql');
var connPool = [];


//Put your mysql configuration settings - user, password, database and port
function getconn(){
	var conn = mysql.createConnection({
	    host     : 'Give your db host name',
	    user     : 'Give username',
	    password : 'Give password',
	    database : 'ImageRecognition',
	    port	 : 3306
	});
	return conn;
}

for(var i = 0;i<5;i++){
	var conn = getconn();
	connPool.push(conn);
}

function exportConn(){
	if(connPool.length !== 0){
		return connPool.pop();
	}
	else{
		setInterval(function(){
			exportConn();
		},1);
	}
}

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	var conn=exportConn();
	console.log("After popping: "+connPool.length);
	conn.query(sqlQuery, function(err, rows, fields) {
		console.log("\nconn released..");
		connPool.push(conn);
		console.log("After pushing: "+connPool.length);
		if(err){
			console.log("In error: " + err.message);
		}
		else 
		{
			console.log("Result: "+rows);
			callback(err, rows);
		}
	});
	
}	

exports.fetchData=fetchData;
