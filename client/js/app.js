// App
const app = angular.module('app', ['ngMaterial']);

// Service to fetch some data..
app.factory('getHistory', ['$http', ($http) => {
	return {
		get: () => $http.get('/getHistory')//getting chat history service
	}
}]);

// App controller
app.controller('appController', ['$scope', 'getHistory', "$http", "$window", function ($scope, getHistory, $http, $window) {
	var es = new EventSource('/stream');//initializing variables and basic $scope methods
	$scope.messages = [];
	$scope.toggle = "gg";//turning on toggle 
	getHistory.get().success(function (ResponseData) {
		if (ResponseData.length != 2) {


			var data = ResponseData;
			var i = 0;
			$scope.messages = [];
			while (i < data.length ) {
				if (data[i].includes("Hey there MR.Messeeks here look at me I've got the answer for you oooooooweeeeee:")) {
					$scope.messages.push({ "name": "Mr.Meeseeks", "message": data[i] })
				}
				else {
					if ((data[i].includes("A new user") && data[i].includes(" has joined the serve")) || (data[i].includes(" is leaving the server") && data[i].includes("The user"))) {
						$scope.messages.push({ "name": "Server", "message": data[i] })
					}
					else {
						holder = data[i].split(":")
						$scope.messages.push({ "name": holder[0], "message": holder[1] })
					}
				}
				i += 1;
			}

		}

	})


	$scope.sendMessage = function () {//sending the message and updating history
		// Don't send an empty message 
		if (!$scope.messageContent || $scope.messageContent === '') {
			return;
		}
		else {
			var data = { name: $scope.MyName, message: $scope.messageContent }
			$scope.history = $http.post('/SendMessage', data).then(function (ResponseData) {
				var i = 0;
				data = ResponseData.data
				$scope.messages = [];
				while (i < data.length) {
					if (data[i].includes("Hey there MR.Messeeks here look at me I've got the answer for you oooooooweeeeee:")) {
						$scope.messages.push({ "name": "Mr.Meeseeks", "message": data[i] })
					}
					else {
						if ((data[i].includes("A new user") && data[i].includes(" has joined the serve")) || (data[i].includes(" is leaving the server") && data[i].includes("The user"))) {
							$scope.messages.push({ "name": "Server", "message": data[i] })
						}
						else {
							holder = data[i].split(":")
							$scope.messages.push({ "name": holder[0], "message": holder[1] })
						}
					}
					i += 1;
				}



			})
			$scope.messageContent = "";
		}
	}

	es.onmessage = function (event) {//when server sent ivent is pushed update history
		var a = JSON.parse(event.data).replace("[", "").replace("]", "");
		var a = a.split("\",\"");
		a[0] = a[0].slice(1);
		a[a.length - 1] = a[a.length - 1].slice(0, -1);

		console.log(typeof a)

		var data = a;
		$scope.messages = [];
		var i = 0;
		while (i < data.length ) {
			if (data[i].includes("Hey there MR.Messeeks here look at me I've got the answer for you oooooooweeeeee:")) {
				$scope.messages.push({ "name": "Mr.Meeseeks", "message": data[i] })
			}
			else {
				if ((data[i].includes("A new user") && data[i].includes(" has joined the serve")) || (data[i].includes(" is leaving the server") && data[i].includes("The user"))) {
					$scope.messages.push({ "name": "Server", "message": data[i] })
				}
				else {
					holder = data[i].split(":")
					$scope.messages.push({ "name": holder[0], "message": holder[1] })
				}
			}

			i += 1;
		}



		$scope.$apply(function () {//teeling angular it was updated
			$scope.messages
		})
	};
	$scope.setUsername = function () {//sending post HTTP packet to server saying the new username
		$scope.MyName = $scope.username;
		$http.post("/setUsername", { "name": $scope.MyName })
		document.getElementById("chatpage").classList.toggle(".chat.page");
		document.getElementById("loginpage").classList.toggle(".chat.page");
		$scope.toggle = undefined;
	}
	window.onbeforeunload = function () {//if the page catches an unload it tells the server the user disconnected
		if ($scope.MyName != undefined) {
			$http.post("/Leaving", { "name": $scope.MyName }).success();

		}
		return;

	};
}]);

