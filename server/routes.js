module.exports = app => {
	var SSE = require('express-sse');
	var sse = new SSE();
	var answers={}
	var history=[]
	app.get('/stream', sse.init);//initializing stream of server sent packets

	app.get(`/`, (req, res) => {//sending base html
		res.sendfile('./public/index.html');
	});
	app.get(`/getHistory`, (req, res) => {//getting message history
		res.send(JSON.stringify(history))
	});


	app.post("/SendMessage", function(req,res){//getting post request sending a meesage 
		var message=req.body.name+": "+req.body.message;
		history.push(message)
		canIAnswer(message)
		console.log(history)
		res.send(history);
		sse.send(JSON.stringify(history));
	});

	app.post("/setUsername", function(req,res){//getting post request giving the username
		var message=" A new user: " + req.body.name + " has joined the server"
		history.push(message)
		console.log(history)
		res.send(history);
		sse.send(JSON.stringify(history));
	});
	app.post("/Leaving", function(req,res){//getting a post request sying the user is leaving
		var message=" The user: " + req.body.name + " is leaving the server"
		history.push(message)
		console.log(history)
		res.send(history);
		sse.send(JSON.stringify(history));
	});
	
	function canIAnswer(message){//bot checks if he can answer some questions :)
	message=message.split(":")
	if (message[1].slice(-1)=="?")
	{
		var i=history.length-3;

		while(i >=2 )
		{
			
			console.log("hellllllllooooo"+typeof history[i]+"     "+i+"           "+history.length+ history[i])
			var holder=history[i].split(":")
			if (message[1]===holder[1] && history[i+1].split(":")[0].includes("MR.Messeeks here look")===false){
				
				var answer="Hey there MR.Messeeks here look at me I've got the answer for you oooooooweeeeee: "+history[i+1].split(":")[1]+" Or atleast "+ history[i+1].split(":")[0]+" Said so."
				break;
			}
			i=i-1;
		}
		if (answer !== undefined && answer !==null){
			console.log("wtf is going on")
			history.push(answer);
		}
		answer="";
		
		return;

	}
	}
	

};

