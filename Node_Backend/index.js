var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mysql = require('mysql');
const request = require('request');
const cities = require("cities-list")

var user_messages = [];
var input_messages = [];
var str = [];
count = 0;
var id = "";
var msg_send = 0;
var responce = {result:[],
								 status:''};

app.get('/', function(req, res){
	res.send("hello =======");
	console.log("000000000000000000")
})

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'ideal',
	database: 'chatbot'
})
var query ="";
io.sockets.on('connection', function(socket){
	console.log("A user connected"); 
	// cities.filter(city => {
	// 	if(city.name == 'indore') console.log(city)
	// 	return city.name.match('Bindura')
	//   })
	socket.on('new-message', function(data){
		// if(data.message.includes('weather')){
		//  str = data.message.split(" ");
		 
		// }
		if(data.trigger == ""){
			str = data.message;
			request("https://www.metaweather.com/api/location/search/?query="+str, function(err, response, body){
				var ans = JSON.parse(body)
				title = ans[0].title;
				request("https://www.metaweather.com/api/location/"+ans[0].woeid, function(err, response,body){
					var result = JSON.parse(body);
					result = result["consolidated_weather"];
					responce.result = result[0];
					responce.result.title = title;
					responce.status = "single";
					socket.emit('new-message', responce)
				})
			})
		}else
		if((data.message.includes('weather'))){ //message fetch from weather api---
			// finding location name in input string---
			str = data.message.split(" ");
			for(var i =0; i<str.length; i++){ 
				var string = str[i];			
				 // city name contain atleast 3 character...
				if(string.length > 2){
					console.log("ppppp")
					var start = new Date();
					request("https://www.metaweather.com/api/location/search/?query="+string, function(error, respons, body){
					//	console.log(respons)
					  var ans = JSON.parse(body);
							console.log("===========+++"+ans.length)
							console.log(string)  
							if(ans.length==1){
								var title = ans[0].title;
								request("https://www.metaweather.com/api/location/"+ans[0].woeid, function(error, response, data){
									var result = JSON.parse(data)
									result = result["consolidated_weather"];
								//	console.log(result[0])
									responce.result = result[0];
									responce.result.title = title;
									responce.status = "single";
									msg_send = 1;
									id = body;
									socket.emit('new-message', responce);
									
								})
							
								}else if(ans.length > 1 ){
								responce.status = "multiple";
								responce.result = ans;
								msg_send = 1;
								id = body;
								socket.emit('new-message', responce)
							}
						var end = new Date() - start;
						console.info('Execution time: %dms', end)
					})
				}
				setTimeout(function(){
					console.log("+++++++++++++++++++")
					console.log("value of str = "+str.length)
					console.log("value of i = "+ i)
					console.log("value of msg_send = "+msg_send);
					if(!msg_send && (str.length) == i){      // when city name does not fount in whole string...
						console.log("not found")
						responce.status = "not fount";
						responce.result = "please enter valid city name, where you want to know weather.";
						socket.emit('new-message', responce);
					
					}	
					msg_send = 0;
					id="";
					i++
			}, 3000)	
			
				
			}
				
			// request("https://www.metaweather.com/api/location/search/?query="+query, function(err, response, body){
			// 	if(err) {console.log("error: -------------------------------"+err);}
			// 	else{
			// 	   var ans = JSON.parse(body)
			// 	}
			// 	console.log(ans)
			// 	if(ans.length==1){
			// 		request("https://www.metaweather.com/api/location/"+ans[0].woeid, function(error, response, data){
			// 		   var result = JSON.parse(data)
			// 		   result = result["consolidated_weather"];
			// 		   console.log(result[0])
			// 		   socket.emit('new-message', result);
			// 		})
			// 	}
				
			// });
			
		}else{ // message fetch from database----
			
			console.log(data)
			input_messages.push(data.message);
		
			var sql = "SELECT * FROM `messages` WHERE _trigger LIKE '%"+data.trigger+"%'";
			console.log(sql)
			con.query(sql, function(err, result){
				console.log(result.length)
				if(result.length !== 0){
					user_messages.push(result[0].msg);
					
					if(user_messages[count]=="enter your phone number."){
						//var otp_code = parseInt(_.random(1000, 9999));
						var otp_code = "1234";
						console.log(otp_code);
						console.log(input_messages)
						console.log("------------------------")
					
					}
					if(result[0].msg =="Enter your full name"){
						var otp_code = "1234";
						if(otp_code==data.message){
							result[0].msg = "your phone number is verified.";
						}
						
					}
					socket.emit('new-message', result[0]);
					count++;
			    }else{
						sql = "SELECT * FROM `messages` WHERE que LIKE '%"+data.message+"%'"; 
						con.query(sql, function(err, result){
							if(err) throw err;
							if(result.length !== 0){
                  socket.emit('new-message', result[0]);
							}else{
								var res = {msg:"", msg_type:'text'}
								res.msg = "sorry i'm a bot, i did not understood this message.";
								result = res;
								socket.emit('new-message', result);
							}
						})
					
					}
			});
	    }
       
    })
});


http.listen(3000,'192.168.1.74', function(){
    console.log("server running at port: 3000");
})