var app = angular.module('app', [])

app.controller('mainCtrl', function ($scope, $http) {

	// CHANGE TO USER BACKGROND
	$scope.getUserData = function() {
		$http.get('/data').then( function (response) {

			if(response.data.background){
				$('body').css({
					'background-image': 'url(' + response.data.background + ')',
					"background-size": "100vw 100vh",
					"background-attachment": "fixed"
				})		
			}
		})
	}
	$scope.getUserData()


	// layoutNav Animation
	$scope.headlineEnter = false
	$scope.jumboDivs = jumboDivs	

	$scope.switchCheck = function (num, action) {
		if(action == 'enter') {
			jumboDivs[num].switch = true	
			for( var i=0; i<jumboDivs.length; i++) {
				if(jumboDivs[i].switch == false) {
					jumboDivs[i].switch2 = true
				}
			}	
		}
		else if(action == 'leave'){
			jumboDivs[num].switch = false
			for( var i=0; i<jumboDivs.length; i++) {
				jumboDivs[i].switch2 = false
			}
		}
	}

	// layoutNav Animation end

	$scope.resetBck = function () {
		$http.post('/resetBck')
	}

	$scope.resetHeadBck = function () {
		$http.post('/resetHeadBck')
	}
})


		
var jumboDivs = [
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
]
